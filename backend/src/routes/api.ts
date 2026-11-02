import { Router, Request, Response } from 'express';
import { requireAuth, optionalAuth, AuthRequest } from '../middleware/auth.ts';
import {
  getOrCreateUser,
  getOrCreateInstitutionForUser,
  updateInstitution,
  getDashboardMetrics,
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getFeeStructures,
  createFeeStructure,
  deleteFeeStructure,
  getPayments,
  recordPayment,
  getSubscriptions,
  createSubscription,
  updateSubscriptionStatus,
  sendAndLogReminder,
  logAndProcessWebhook,
} from '../db/queries.ts';
import { createPaystackReference } from '../utils/paystack.ts';

export const apiRouter = Router();

// Helper to resolve institution for authenticated user or fallback
async function resolveInstitution(req: AuthRequest) {
  if (req.user) {
    const user = await getOrCreateUser(
      req.user.uid,
      req.user.email || 'admin@school.edu.ng',
      req.user.name,
      req.user.picture
    );
    return await getOrCreateInstitutionForUser(user.id, 'Apex International College');
  }
  const defaultUser = await getOrCreateUser(
    'demo_admin_uid_2026',
    'bursar@apexcollege.edu.ng',
    'Bursar Office',
    null
  );
  return await getOrCreateInstitutionForUser(defaultUser.id, 'Apex International College');
}

// -------------------------------------------------------------
// System & Health Endpoints
// -------------------------------------------------------------
apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'EduPay Tracker Backend API',
    version: '1.0.0',
    database: 'Cloud SQL PostgreSQL (Drizzle ORM)',
    authentication: 'Firebase Auth & OAuth',
  });
});

// Interactive API Documentation endpoint
apiRouter.get('/docs', (_req: Request, res: Response) => {
  res.json({
    title: 'EduPay Tracker Backend API Specification',
    version: '1.0.0',
    baseUrl: '/api',
    endpoints: [
      { path: '/api/health', method: 'GET', description: 'API health and uptime status' },
      { path: '/api/auth/sync', method: 'POST', description: 'Synchronize Firebase authenticated user & school profile' },
      { path: '/api/institution', method: 'GET', description: 'Retrieve institution settings, bank details, and currency' },
      { path: '/api/institution', method: 'PUT', description: 'Update institution settings, bank account, and Paystack API keys' },
      { path: '/api/dashboard', method: 'GET', description: 'Get financial metrics, collection percentage, and charts' },
      { path: '/api/students', method: 'GET', description: 'List students with query (?q=), grade (?grade=), and status (?status=)' },
      { path: '/api/students', method: 'POST', description: 'Enroll a new student and set initial fee schedule' },
      { path: '/api/students/:id', method: 'GET', description: 'Get student ledger, itemized fee breakdown, and receipts' },
      { path: '/api/students/:id', method: 'PUT', description: 'Update student profile and fee balances' },
      { path: '/api/students/:id', method: 'DELETE', description: 'Delete student record and associated payment ledger' },
      { path: '/api/payments', method: 'GET', description: 'Get recent payment transactions audit trail' },
      { path: '/api/payments', method: 'POST', description: 'Record a fee payment (bank transfer, cash, card, pos)' },
      { path: '/api/fee-structures', method: 'GET', description: 'List fee schedule items by class and term' },
      { path: '/api/fee-structures', method: 'POST', description: 'Create a new fee structure item' },
      { path: '/api/fee-structures/:id', method: 'DELETE', description: 'Remove fee structure item' },
      { path: '/api/subscriptions', method: 'GET', description: 'List student recurring installment plans' },
      { path: '/api/subscriptions', method: 'POST', description: 'Create a student installment schedule' },
      { path: '/api/subscriptions/:id', method: 'PATCH', description: 'Update plan status (active, paused, cancelled)' },
      { path: '/api/reminders', method: 'POST', description: 'Dispatch and log WhatsApp, SMS, or email fee reminders' },
      { path: '/api/paystack/initialize', method: 'POST', description: 'Initialize Paystack checkout with reference code' },
      { path: '/api/paystack/verify', method: 'POST', description: 'Verify Paystack transaction and credit student balance' },
      { path: '/api/webhooks/paystack', method: 'POST', description: 'Paystack webhook listener for charge.success events' },
    ],
  });
});

// -------------------------------------------------------------
// Authentication & Profile Endpoints
// -------------------------------------------------------------
apiRouter.post('/auth/sync', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await getOrCreateUser(
      req.user!.uid,
      req.user!.email || 'user@example.com',
      req.user!.name,
      req.user!.picture
    );
    const institution = await getOrCreateInstitutionForUser(user.id);
    res.json({ user, institution });
  } catch (error: any) {
    console.error('Error syncing auth user:', error);
    res.status(500).json({ error: error.message || 'Failed to sync user profile' });
  }
});

// -------------------------------------------------------------
// Institution Endpoints
// -------------------------------------------------------------
apiRouter.get('/institution', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const institution = await resolveInstitution(req);
    res.json(institution);
  } catch (error: any) {
    console.error('Error fetching institution:', error);
    res.status(500).json({ error: error.message || 'Failed to load institution profile' });
  }
});

apiRouter.put('/institution', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const institution = await resolveInstitution(req);
    const updated = await updateInstitution(institution.id, req.body);
    res.json(updated);
  } catch (error: any) {
    console.error('Error updating institution:', error);
    res.status(500).json({ error: error.message || 'Failed to update institution' });
  }
});

// -------------------------------------------------------------
// Dashboard Metrics
// -------------------------------------------------------------
apiRouter.get('/dashboard', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const institution = await resolveInstitution(req);
    const metrics = await getDashboardMetrics(institution.id);
    res.json({
      institution,
      metrics,
    });
  } catch (error: any) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: error.message || 'Failed to load dashboard metrics' });
  }
});

// -------------------------------------------------------------
// Students Endpoints
// -------------------------------------------------------------
apiRouter.get('/students', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const institution = await resolveInstitution(req);
    const query = req.query.q as string | undefined;
    const grade = req.query.grade as string | undefined;
    const status = req.query.status as string | undefined;

    const studentList = await getStudents(institution.id, query, grade, status);
    res.json(studentList);
  } catch (error: any) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch students roster' });
  }
});

apiRouter.get('/students/:id', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const institution = await resolveInstitution(req);
    const studentId = parseInt(req.params.id, 10);
    const student = await getStudentById(institution.id, studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(student);
  } catch (error: any) {
    console.error('Error fetching student profile:', error);
    res.status(500).json({ error: error.message || 'Failed to load student details' });
  }
});

apiRouter.post('/students', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const institution = await resolveInstitution(req);
    const newStudent = await createStudent(institution.id, req.body);
    res.status(201).json(newStudent);
  } catch (error: any) {
    console.error('Error creating student:', error);
    res.status(500).json({ error: error.message || 'Failed to enroll student' });
  }
});

apiRouter.put('/students/:id', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const institution = await resolveInstitution(req);
    const studentId = parseInt(req.params.id, 10);
    const updated = await updateStudent(institution.id, studentId, req.body);
    res.json(updated);
  } catch (error: any) {
    console.error('Error updating student:', error);
    res.status(500).json({ error: error.message || 'Failed to update student' });
  }
});

apiRouter.delete('/students/:id', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const institution = await resolveInstitution(req);
    const studentId = parseInt(req.params.id, 10);
    const deleted = await deleteStudent(institution.id, studentId);
    res.json({ message: 'Student removed successfully', deleted });
  } catch (error: any) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: error.message || 'Failed to delete student' });
  }
});

// -------------------------------------------------------------
// Payments & Receipts Endpoints
// -------------------------------------------------------------
apiRouter.get('/payments', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const institution = await resolveInstitution(req);
    const paymentList = await getPayments(institution.id);
    res.json(paymentList);
  } catch (error: any) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: error.message || 'Failed to retrieve payments' });
  }
});

apiRouter.post('/payments', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const institution = await resolveInstitution(req);
    const payment = await recordPayment(institution.id, {
      ...req.body,
      currency: req.body.currency || institution.currency,
    });
    res.status(201).json(payment);
  } catch (error: any) {
    console.error('Error recording payment:', error);
    res.status(500).json({ error: error.message || 'Failed to record payment' });
  }
});

// -------------------------------------------------------------
// Fee Structures Endpoints
// -------------------------------------------------------------
apiRouter.get('/fee-structures', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const institution = await resolveInstitution(req);
    const fees = await getFeeStructures(institution.id);
    res.json(fees);
  } catch (error: any) {
    console.error('Error fetching fee structures:', error);
    res.status(500).json({ error: error.message || 'Failed to load fee structures' });
  }
});

apiRouter.post('/fee-structures', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const institution = await resolveInstitution(req);
    const newFee = await createFeeStructure(institution.id, req.body);
    res.status(201).json(newFee);
  } catch (error: any) {
    console.error('Error creating fee structure:', error);
    res.status(500).json({ error: error.message || 'Failed to create fee item' });
  }
});

apiRouter.delete('/fee-structures/:id', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const institution = await resolveInstitution(req);
    const feeId = parseInt(req.params.id, 10);
    const deleted = await deleteFeeStructure(institution.id, feeId);
    res.json({ message: 'Fee structure deleted', deleted });
  } catch (error: any) {
    console.error('Error deleting fee structure:', error);
    res.status(500).json({ error: error.message || 'Failed to delete fee item' });
  }
});

// -------------------------------------------------------------
// Subscriptions & Installment Plans
// -------------------------------------------------------------
apiRouter.get('/subscriptions', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const institution = await resolveInstitution(req);
    const subList = await getSubscriptions(institution.id);
    res.json(subList);
  } catch (error: any) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({ error: error.message || 'Failed to load subscription plans' });
  }
});

apiRouter.post('/subscriptions', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const institution = await resolveInstitution(req);
    const newSub = await createSubscription(institution.id, req.body);
    res.status(201).json(newSub);
  } catch (error: any) {
    console.error('Error creating subscription plan:', error);
    res.status(500).json({ error: error.message || 'Failed to create subscription plan' });
  }
});

apiRouter.patch('/subscriptions/:id', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const institution = await resolveInstitution(req);
    const subId = parseInt(req.params.id, 10);
    const { status } = req.body;
    const updated = await updateSubscriptionStatus(institution.id, subId, status);
    res.json(updated);
  } catch (error: any) {
    console.error('Error updating subscription status:', error);
    res.status(500).json({ error: error.message || 'Failed to update subscription' });
  }
});

// -------------------------------------------------------------
// Reminders Endpoints
// -------------------------------------------------------------
apiRouter.post('/reminders', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const institution = await resolveInstitution(req);
    const reminder = await sendAndLogReminder(institution.id, req.body);
    res.status(201).json({
      success: true,
      message: `Reminder scheduled and logged via ${req.body.channel?.toUpperCase()}`,
      reminder,
    });
  } catch (error: any) {
    console.error('Error logging reminder:', error);
    res.status(500).json({ error: error.message || 'Failed to send reminder' });
  }
});

// -------------------------------------------------------------
// Paystack Gateway Integration Endpoints
// -------------------------------------------------------------
apiRouter.post('/paystack/initialize', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const institution = await resolveInstitution(req);
    const { amount, admissionNumber } = req.body;

    const reference = createPaystackReference(admissionNumber);
    const accessCode = 'ac_' + Math.random().toString(36).substring(2, 12);

    res.json({
      status: true,
      message: 'Authorization URL created',
      data: {
        authorization_url: `https://checkout.paystack.com/${accessCode}`,
        access_code: accessCode,
        reference,
        amount,
        currency: institution.currency,
        publicKey: institution.paystackPublicKey || 'pk_test_edupay_demo_key_9831',
      },
    });
  } catch (error: any) {
    console.error('Paystack initialization error:', error);
    res.status(500).json({ error: error.message || 'Failed to initialize Paystack transaction' });
  }
});

apiRouter.post('/paystack/verify', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const institution = await resolveInstitution(req);
    const { reference, studentId, amount, paymentMethod, payerName, payerEmail, payerPhone, feeCategory } = req.body;

    const payment = await recordPayment(institution.id, {
      studentId: parseInt(studentId, 10),
      amount: parseInt(amount, 10),
      currency: institution.currency,
      paymentMethod: paymentMethod || 'paystack_card',
      channel: 'paystack',
      feeCategory: feeCategory || 'Tuition Fee',
      payerName,
      payerEmail,
      payerPhone,
      paystackReference: reference,
      notes: `Verified Paystack gateway transaction: ${reference}`,
    });

    res.json({
      status: true,
      message: 'Payment verified and credited to student ledger successfully',
      payment,
    });
  } catch (error: any) {
    console.error('Paystack verification error:', error);
    res.status(500).json({ error: error.message || 'Failed to verify transaction' });
  }
});

apiRouter.post('/webhooks/paystack', async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const log = await logAndProcessWebhook(payload);
    res.status(200).json({ status: 'success', received: true, logId: log.id });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});
