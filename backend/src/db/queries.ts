import { eq, desc, and, sql } from 'drizzle-orm';
import { db } from '../config/db.ts';
import {
  users,
  institutions,
  feeStructures,
  students,
  payments,
  subscriptions,
  paymentReminders,
  webhookLogs,
} from './schema.ts';
import { generateReceiptNumber, generateReference } from '../utils/formatters.ts';

// Get or create user from Auth UID
export async function getOrCreateUser(
  uid: string,
  email: string,
  displayName?: string | null,
  photoUrl?: string | null
) {
  try {
    const existing = await db.select().from(users).where(eq(users.uid, uid)).limit(1);
    if (existing.length > 0) {
      if (displayName || photoUrl) {
        await db
          .update(users)
          .set({
            displayName: displayName || existing[0].displayName,
            photoUrl: photoUrl || existing[0].photoUrl,
          })
          .where(eq(users.id, existing[0].id));
      }
      return existing[0];
    }

    const [newUser] = await db
      .insert(users)
      .values({
        uid,
        email,
        displayName: displayName || email.split('@')[0],
        photoUrl: photoUrl || null,
        role: 'admin',
      })
      .returning();

    await getOrCreateInstitutionForUser(newUser.id, displayName || 'Apex Academy');
    return newUser;
  } catch (error) {
    console.error('getOrCreateUser error:', error);
    throw new Error('Failed to resolve user account.', { cause: error });
  }
}

// Get or create institution
export async function getOrCreateInstitutionForUser(
  userId: number,
  institutionName: string = 'Apex International College'
) {
  try {
    const existing = await db.select().from(institutions).where(eq(institutions.userId, userId)).limit(1);
    if (existing.length > 0) {
      return existing[0];
    }

    const [newInst] = await db
      .insert(institutions)
      .values({
        userId,
        name: institutionName,
        code: 'AIC-' + Math.floor(100 + Math.random() * 900),
        motto: 'Excellence in Knowledge & Character',
        currency: 'NGN',
        address: '14 Admiralty Way, Victoria Island, Lagos, Nigeria',
        phone: '+234 803 123 4567',
        email: 'bursar@apexcollege.edu.ng',
        bankName: 'Zenith Bank Plc',
        bankAccountName: 'Apex International College Fee Account',
        bankAccountNumber: '1014892019',
        paystackPublicKey: 'pk_test_edupay_demo_key_9831',
        paystackSecretKey: 'sk_test_edupay_demo_key_4412',
        currentTerm: 'First Term',
        currentSession: '2026/2027',
      })
      .returning();

    await seedInstitutionDemoData(newInst.id);
    return newInst;
  } catch (error) {
    console.error('getOrCreateInstitutionForUser error:', error);
    throw new Error('Failed to get or create school institution.', { cause: error });
  }
}

// Seed initial realistic data for new school
export async function seedInstitutionDemoData(institutionId: number) {
  try {
    const feeItems = [
      { institutionId, name: 'Tuition Fee (Primary)', gradeLevel: 'Primary 1-6', category: 'Tuition', term: 'First Term', amount: 180000, isCompulsory: true },
      { institutionId, name: 'Tuition Fee (Junior Secondary)', gradeLevel: 'JSS 1-3', category: 'Tuition', term: 'First Term', amount: 250000, isCompulsory: true },
      { institutionId, name: 'Tuition Fee (Senior Secondary)', gradeLevel: 'SSS 1-3', category: 'Tuition', term: 'First Term', amount: 320000, isCompulsory: true },
      { institutionId, name: 'ICT & STEM Laboratory Levy', gradeLevel: 'All', category: 'ICT & Lab', term: 'First Term', amount: 35000, isCompulsory: true },
      { institutionId, name: 'Textbooks & Learning Material Kit', gradeLevel: 'All', category: 'Books', term: 'First Term', amount: 45000, isCompulsory: false },
      { institutionId, name: 'PTA Development Levy', gradeLevel: 'All', category: 'Development', term: 'First Term', amount: 20000, isCompulsory: true },
    ];
    await db.insert(feeStructures).values(feeItems);

    const studentData = [
      {
        institutionId,
        admissionNumber: 'AIC/2026/041',
        firstName: 'Chidinma',
        lastName: 'Okonkwo',
        gradeLevel: 'SSS 2',
        guardianName: 'Dr. Emeka Okonkwo',
        guardianPhone: '+234 802 334 1122',
        guardianEmail: 'emeka.okonkwo@example.com',
        gender: 'Female',
        totalBilled: 375000,
        totalPaid: 375000,
        status: 'paid' as const,
      },
      {
        institutionId,
        admissionNumber: 'AIC/2026/088',
        firstName: 'Tunde',
        lastName: 'Adeleke',
        gradeLevel: 'JSS 3',
        guardianName: 'Mrs. Folashade Adeleke',
        guardianPhone: '+234 803 778 9900',
        guardianEmail: 'f.adeleke@example.com',
        gender: 'Male',
        totalBilled: 305000,
        totalPaid: 150000,
        status: 'partial' as const,
      },
      {
        institutionId,
        admissionNumber: 'AIC/2026/104',
        firstName: 'Zainab',
        lastName: 'Bello',
        gradeLevel: 'Primary 5',
        guardianName: 'Alhaji Haruna Bello',
        guardianPhone: '+234 805 221 4455',
        guardianEmail: 'h.bello@example.com',
        gender: 'Female',
        totalBilled: 235000,
        totalPaid: 0,
        status: 'overdue' as const,
      },
      {
        institutionId,
        admissionNumber: 'AIC/2026/122',
        firstName: 'Somtochukwu',
        lastName: 'Eze',
        gradeLevel: 'SSS 3',
        guardianName: 'Engr. Patrick Eze',
        guardianPhone: '+234 818 900 1234',
        guardianEmail: 'p.eze@example.com',
        gender: 'Male',
        totalBilled: 375000,
        totalPaid: 200000,
        status: 'partial' as const,
      },
      {
        institutionId,
        admissionNumber: 'AIC/2026/145',
        firstName: 'Khadijat',
        lastName: 'Abubakar',
        gradeLevel: 'JSS 1',
        guardianName: 'Barr. Aisha Abubakar',
        guardianPhone: '+234 809 456 7890',
        guardianEmail: 'aisha.abubakar@example.com',
        gender: 'Female',
        totalBilled: 305000,
        totalPaid: 305000,
        status: 'paid' as const,
      },
      {
        institutionId,
        admissionNumber: 'AIC/2026/177',
        firstName: 'David',
        lastName: 'Ogunleye',
        gradeLevel: 'Primary 3',
        guardianName: 'Mr. Kehinde Ogunleye',
        guardianPhone: '+234 802 889 0011',
        guardianEmail: 'k.ogunleye@example.com',
        gender: 'Male',
        totalBilled: 235000,
        totalPaid: 50000,
        status: 'partial' as const,
      },
    ];

    const insertedStudents = await db.insert(students).values(studentData).returning();

    const student1 = insertedStudents.find((s) => s.admissionNumber === 'AIC/2026/041');
    const student2 = insertedStudents.find((s) => s.admissionNumber === 'AIC/2026/088');
    const student4 = insertedStudents.find((s) => s.admissionNumber === 'AIC/2026/122');
    const student5 = insertedStudents.find((s) => s.admissionNumber === 'AIC/2026/145');
    const student6 = insertedStudents.find((s) => s.admissionNumber === 'AIC/2026/177');

    const paymentItems = [];
    if (student1) {
      paymentItems.push({
        institutionId,
        studentId: student1.id,
        reference: generateReference('PAY-OKON'),
        amount: 375000,
        currency: 'NGN',
        paymentMethod: 'paystack_card' as const,
        channel: 'paystack' as const,
        status: 'success' as const,
        feeCategory: 'Tuition & Levies Full Term',
        term: 'First Term 2026/2027',
        payerName: 'Dr. Emeka Okonkwo',
        payerEmail: 'emeka.okonkwo@example.com',
        payerPhone: '+234 802 334 1122',
        paystackReference: 'PSTK_' + Math.random().toString(36).substring(2, 10),
        receiptNumber: generateReceiptNumber(),
        notes: 'Full payment via Paystack Visa Debit',
        paidAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      });
    }

    if (student2) {
      paymentItems.push({
        institutionId,
        studentId: student2.id,
        reference: generateReference('PAY-ADEL'),
        amount: 150000,
        currency: 'NGN',
        paymentMethod: 'paystack_bank' as const,
        channel: 'paystack' as const,
        status: 'success' as const,
        feeCategory: 'Tuition Fee 1st Installment',
        term: 'First Term 2026/2027',
        payerName: 'Mrs. Folashade Adeleke',
        payerEmail: 'f.adeleke@example.com',
        payerPhone: '+234 803 778 9900',
        paystackReference: 'PSTK_' + Math.random().toString(36).substring(2, 10),
        receiptNumber: generateReceiptNumber(),
        notes: 'Part payment installment via Paystack Direct Bank Transfer',
        paidAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      });
    }

    if (student4) {
      paymentItems.push({
        institutionId,
        studentId: student4.id,
        reference: generateReference('PAY-EZE'),
        amount: 200000,
        currency: 'NGN',
        paymentMethod: 'bank_transfer' as const,
        channel: 'manual' as const,
        status: 'success' as const,
        feeCategory: 'Tuition Partial Deposit',
        term: 'First Term 2026/2027',
        payerName: 'Engr. Patrick Eze',
        payerEmail: 'p.eze@example.com',
        payerPhone: '+234 818 900 1234',
        paystackReference: null,
        receiptNumber: generateReceiptNumber(),
        notes: 'Direct transfer to school Zenith Bank account',
        paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      });
    }

    if (student5) {
      paymentItems.push({
        institutionId,
        studentId: student5.id,
        reference: generateReference('PAY-ABUB'),
        amount: 305000,
        currency: 'NGN',
        paymentMethod: 'paystack_card' as const,
        channel: 'paystack' as const,
        status: 'success' as const,
        feeCategory: 'Full Term Tuition & Kit',
        term: 'First Term 2026/2027',
        payerName: 'Barr. Aisha Abubakar',
        payerEmail: 'aisha.abubakar@example.com',
        payerPhone: '+234 809 456 7890',
        paystackReference: 'PSTK_' + Math.random().toString(36).substring(2, 10),
        receiptNumber: generateReceiptNumber(),
        notes: 'Paid online via Paystack Mastercard',
        paidAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      });
    }

    if (student6) {
      paymentItems.push({
        institutionId,
        studentId: student6.id,
        reference: generateReference('PAY-OGUN'),
        amount: 50000,
        currency: 'NGN',
        paymentMethod: 'cash' as const,
        channel: 'manual' as const,
        status: 'success' as const,
        feeCategory: 'ICT & Registration Deposit',
        term: 'First Term 2026/2027',
        payerName: 'Mr. Kehinde Ogunleye',
        payerEmail: 'k.ogunleye@example.com',
        payerPhone: '+234 802 889 0011',
        paystackReference: null,
        receiptNumber: generateReceiptNumber(),
        notes: 'Cash paid at bursary counter',
        paidAt: new Date(),
      });
    }

    if (paymentItems.length > 0) {
      await db.insert(payments).values(paymentItems);
    }

    if (student2) {
      await db.insert(subscriptions).values({
        institutionId,
        studentId: student2.id,
        planName: 'JSS 3 Termly Split Billing (3 Batches)',
        planCode: 'PLN_jss3_split_26',
        interval: 'monthly',
        amount: 51666,
        status: 'active',
        nextPaymentDate: '2026-11-25',
        autoDebitEnabled: true,
      });
    }

    if (student4) {
      await db.insert(subscriptions).values({
        institutionId,
        studentId: student4.id,
        planName: 'SSS 3 Senior Tuition Bi-Weekly Plan',
        planCode: 'PLN_sss3_biwk_26',
        interval: 'monthly',
        amount: 87500,
        status: 'active',
        nextPaymentDate: '2026-11-30',
        autoDebitEnabled: true,
      });
    }
  } catch (error) {
    console.error('seedInstitutionDemoData error:', error);
  }
}

// Update institution
export async function updateInstitution(institutionId: number, data: Partial<typeof institutions.$inferInsert>) {
  try {
    const [updated] = await db
      .update(institutions)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(institutions.id, institutionId))
      .returning();
    return updated;
  } catch (error) {
    console.error('updateInstitution error:', error);
    throw new Error('Failed to update institution settings.', { cause: error });
  }
}

// Dashboard metrics
export async function getDashboardMetrics(institutionId: number) {
  try {
    const studentList = await db.select().from(students).where(eq(students.institutionId, institutionId));
    const recentPayments = await db
      .select({
        id: payments.id,
        institutionId: payments.institutionId,
        studentId: payments.studentId,
        studentName: sql<string>`concat(${students.firstName}, ' ', ${students.lastName})`,
        admissionNumber: students.admissionNumber,
        reference: payments.reference,
        amount: payments.amount,
        currency: payments.currency,
        paymentMethod: payments.paymentMethod,
        channel: payments.channel,
        status: payments.status,
        feeCategory: payments.feeCategory,
        term: payments.term,
        payerName: payments.payerName,
        payerEmail: payments.payerEmail,
        payerPhone: payments.payerPhone,
        paystackReference: payments.paystackReference,
        receiptNumber: payments.receiptNumber,
        notes: payments.notes,
        paidAt: payments.paidAt,
      })
      .from(payments)
      .leftJoin(students, eq(payments.studentId, students.id))
      .where(eq(payments.institutionId, institutionId))
      .orderBy(desc(payments.paidAt))
      .limit(8);

    const totalBilled = studentList.reduce((acc, s) => acc + s.totalBilled, 0);
    const totalCollected = studentList.reduce((acc, s) => acc + s.totalPaid, 0);
    const totalOutstanding = Math.max(0, totalBilled - totalCollected);
    const collectionRate = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0;

    const totalStudents = studentList.length;
    const paidStudents = studentList.filter((s) => s.status === 'paid').length;
    const partialStudents = studentList.filter((s) => s.status === 'partial').length;
    const overdueStudents = studentList.filter((s) => s.status === 'overdue').length;

    const chartData = [
      { month: 'Jul', amount: Math.round(totalCollected * 0.15), count: 8 },
      { month: 'Aug', amount: Math.round(totalCollected * 0.25), count: 14 },
      { month: 'Sep', amount: Math.round(totalCollected * 0.35), count: 26 },
      { month: 'Oct', amount: Math.round(totalCollected * 0.15), count: 12 },
      { month: 'Nov', amount: Math.round(totalCollected * 0.1), count: 6 },
    ];

    return {
      totalBilled,
      totalCollected,
      totalOutstanding,
      collectionRate,
      totalStudents,
      paidStudents,
      partialStudents,
      overdueStudents,
      recentPayments,
      chartData,
    };
  } catch (error) {
    console.error('getDashboardMetrics error:', error);
    throw new Error('Failed to compute dashboard metrics.', { cause: error });
  }
}

// Students queries
export async function getStudents(institutionId: number, query?: string, grade?: string, status?: string) {
  try {
    const conditions = [eq(students.institutionId, institutionId)];

    if (status && status !== 'all') {
      conditions.push(eq(students.status, status));
    }

    if (grade && grade !== 'all') {
      conditions.push(eq(students.gradeLevel, grade));
    }

    const result = await db.select().from(students).where(and(...conditions)).orderBy(desc(students.id));

    if (query && query.trim() !== '') {
      const q = query.toLowerCase().trim();
      return result.filter(
        (s) =>
          s.firstName.toLowerCase().includes(q) ||
          s.lastName.toLowerCase().includes(q) ||
          s.admissionNumber.toLowerCase().includes(q) ||
          s.guardianName.toLowerCase().includes(q) ||
          s.guardianPhone.toLowerCase().includes(q)
      );
    }

    return result;
  } catch (error) {
    console.error('getStudents error:', error);
    throw new Error('Failed to retrieve students roster.', { cause: error });
  }
}

export async function getStudentById(institutionId: number, studentId: number) {
  try {
    const studentArr = await db
      .select()
      .from(students)
      .where(and(eq(students.institutionId, institutionId), eq(students.id, studentId)))
      .limit(1);

    if (studentArr.length === 0) return null;
    const student = studentArr[0];

    const studentPayments = await db
      .select()
      .from(payments)
      .where(and(eq(payments.institutionId, institutionId), eq(payments.studentId, studentId)))
      .orderBy(desc(payments.paidAt));

    const studentSubscriptions = await db
      .select()
      .from(subscriptions)
      .where(and(eq(subscriptions.institutionId, institutionId), eq(subscriptions.studentId, studentId)))
      .orderBy(desc(subscriptions.createdAt));

    const studentReminders = await db
      .select()
      .from(paymentReminders)
      .where(and(eq(paymentReminders.institutionId, institutionId), eq(paymentReminders.studentId, studentId)))
      .orderBy(desc(paymentReminders.sentAt));

    return {
      ...student,
      payments: studentPayments,
      subscriptions: studentSubscriptions,
      reminders: studentReminders,
    };
  } catch (error) {
    console.error('getStudentById error:', error);
    throw new Error('Failed to retrieve student details.', { cause: error });
  }
}

export async function createStudent(
  institutionId: number,
  data: {
    admissionNumber: string;
    firstName: string;
    lastName: string;
    gradeLevel: string;
    guardianName: string;
    guardianPhone: string;
    guardianEmail?: string;
    gender?: string;
    totalBilled?: number;
  }
) {
  try {
    let billed = data.totalBilled;
    if (billed === undefined || billed === 0) {
      const fees = await db.select().from(feeStructures).where(eq(feeStructures.institutionId, institutionId));
      const relevantFees = fees.filter((f) => f.gradeLevel === 'All' || f.gradeLevel.includes(data.gradeLevel));
      billed = relevantFees.reduce((acc, f) => acc + f.amount, 0);
      if (billed === 0) billed = 250000;
    }

    const [newStudent] = await db
      .insert(students)
      .values({
        institutionId,
        admissionNumber: data.admissionNumber,
        firstName: data.firstName,
        lastName: data.lastName,
        gradeLevel: data.gradeLevel,
        guardianName: data.guardianName,
        guardianPhone: data.guardianPhone,
        guardianEmail: data.guardianEmail || null,
        gender: data.gender || 'Other',
        totalBilled: billed,
        totalPaid: 0,
        status: 'overdue',
      })
      .returning();

    return newStudent;
  } catch (error) {
    console.error('createStudent error:', error);
    throw new Error('Failed to register student.', { cause: error });
  }
}

export async function updateStudent(
  institutionId: number,
  studentId: number,
  data: Partial<typeof students.$inferInsert>
) {
  try {
    const current = await db
      .select()
      .from(students)
      .where(and(eq(students.institutionId, institutionId), eq(students.id, studentId)))
      .limit(1);

    if (current.length === 0) throw new Error('Student not found');

    const billed = data.totalBilled !== undefined ? data.totalBilled : current[0].totalBilled;
    const paid = data.totalPaid !== undefined ? data.totalPaid : current[0].totalPaid;

    let newStatus = current[0].status;
    if (paid >= billed && billed > 0) {
      newStatus = 'paid';
    } else if (paid > 0) {
      newStatus = 'partial';
    } else {
      newStatus = 'overdue';
    }

    const [updated] = await db
      .update(students)
      .set({
        ...data,
        status: newStatus,
      })
      .where(and(eq(students.institutionId, institutionId), eq(students.id, studentId)))
      .returning();

    return updated;
  } catch (error) {
    console.error('updateStudent error:', error);
    throw new Error('Failed to update student profile.', { cause: error });
  }
}

export async function deleteStudent(institutionId: number, studentId: number) {
  try {
    await db
      .delete(paymentReminders)
      .where(and(eq(paymentReminders.institutionId, institutionId), eq(paymentReminders.studentId, studentId)));
    await db
      .delete(subscriptions)
      .where(and(eq(subscriptions.institutionId, institutionId), eq(subscriptions.studentId, studentId)));
    await db
      .delete(payments)
      .where(and(eq(payments.institutionId, institutionId), eq(payments.studentId, studentId)));
    const [deleted] = await db
      .delete(students)
      .where(and(eq(students.institutionId, institutionId), eq(students.id, studentId)))
      .returning();
    return deleted;
  } catch (error) {
    console.error('deleteStudent error:', error);
    throw new Error('Failed to delete student.', { cause: error });
  }
}

// Payments queries
export async function getPayments(institutionId: number, limitCount: number = 50) {
  try {
    return await db
      .select({
        id: payments.id,
        institutionId: payments.institutionId,
        studentId: payments.studentId,
        studentName: sql<string>`concat(${students.firstName}, ' ', ${students.lastName})`,
        admissionNumber: students.admissionNumber,
        reference: payments.reference,
        amount: payments.amount,
        currency: payments.currency,
        paymentMethod: payments.paymentMethod,
        channel: payments.channel,
        status: payments.status,
        feeCategory: payments.feeCategory,
        term: payments.term,
        payerName: payments.payerName,
        payerEmail: payments.payerEmail,
        payerPhone: payments.payerPhone,
        paystackReference: payments.paystackReference,
        receiptNumber: payments.receiptNumber,
        notes: payments.notes,
        paidAt: payments.paidAt,
      })
      .from(payments)
      .leftJoin(students, eq(payments.studentId, students.id))
      .where(eq(payments.institutionId, institutionId))
      .orderBy(desc(payments.paidAt))
      .limit(limitCount);
  } catch (error) {
    console.error('getPayments error:', error);
    throw new Error('Failed to retrieve payments history.', { cause: error });
  }
}

export async function recordPayment(
  institutionId: number,
  data: {
    studentId: number;
    amount: number;
    currency?: string;
    paymentMethod: any;
    channel?: 'paystack' | 'manual';
    feeCategory?: string;
    term?: string;
    payerName?: string;
    payerEmail?: string;
    payerPhone?: string;
    paystackReference?: string;
    notes?: string;
  }
) {
  try {
    const student = await db
      .select()
      .from(students)
      .where(and(eq(students.institutionId, institutionId), eq(students.id, data.studentId)))
      .limit(1);

    if (student.length === 0) {
      throw new Error('Student not found for payment allocation.');
    }

    const ref = generateReference(data.channel === 'paystack' ? 'PSTK' : 'PAY');
    const rcpt = generateReceiptNumber();

    const [newPayment] = await db
      .insert(payments)
      .values({
        institutionId,
        studentId: data.studentId,
        reference: ref,
        amount: data.amount,
        currency: data.currency || 'NGN',
        paymentMethod: data.paymentMethod,
        channel: data.channel || 'manual',
        status: 'success',
        feeCategory: data.feeCategory || 'School Fees',
        term: data.term || 'First Term 2026/2027',
        payerName: data.payerName || student[0].guardianName,
        payerEmail: data.payerEmail || student[0].guardianEmail,
        payerPhone: data.payerPhone || student[0].guardianPhone,
        paystackReference:
          data.paystackReference ||
          (data.channel === 'paystack' ? 'TRX_' + Math.random().toString(36).substring(2, 10) : null),
        receiptNumber: rcpt,
        notes: data.notes || '',
        paidAt: new Date(),
      })
      .returning();

    const newPaid = student[0].totalPaid + data.amount;
    let newStatus = student[0].status;
    if (newPaid >= student[0].totalBilled && student[0].totalBilled > 0) {
      newStatus = 'paid';
    } else if (newPaid > 0) {
      newStatus = 'partial';
    } else {
      newStatus = 'overdue';
    }

    await db
      .update(students)
      .set({
        totalPaid: newPaid,
        status: newStatus,
      })
      .where(eq(students.id, student[0].id));

    return {
      ...newPayment,
      studentName: `${student[0].firstName} ${student[0].lastName}`,
      admissionNumber: student[0].admissionNumber,
    };
  } catch (error) {
    console.error('recordPayment error:', error);
    throw new Error('Failed to process and record payment transaction.', { cause: error });
  }
}

// Fee structures
export async function getFeeStructures(institutionId: number) {
  try {
    return await db.select().from(feeStructures).where(eq(feeStructures.institutionId, institutionId)).orderBy(desc(feeStructures.id));
  } catch (error) {
    console.error('getFeeStructures error:', error);
    throw new Error('Failed to retrieve fee structures.', { cause: error });
  }
}

export async function createFeeStructure(
  institutionId: number,
  data: {
    name: string;
    gradeLevel: string;
    category: string;
    term: string;
    amount: number;
    isCompulsory?: boolean;
  }
) {
  try {
    const [newFee] = await db
      .insert(feeStructures)
      .values({
        institutionId,
        name: data.name,
        gradeLevel: data.gradeLevel,
        category: data.category || 'Tuition',
        term: data.term || 'First Term',
        amount: data.amount,
        isCompulsory: data.isCompulsory ?? true,
      })
      .returning();
    return newFee;
  } catch (error) {
    console.error('createFeeStructure error:', error);
    throw new Error('Failed to create fee item.', { cause: error });
  }
}

export async function deleteFeeStructure(institutionId: number, feeId: number) {
  try {
    const [deleted] = await db
      .delete(feeStructures)
      .where(and(eq(feeStructures.institutionId, institutionId), eq(feeStructures.id, feeId)))
      .returning();
    return deleted;
  } catch (error) {
    console.error('deleteFeeStructure error:', error);
    throw new Error('Failed to delete fee structure.', { cause: error });
  }
}

// Subscriptions
export async function getSubscriptions(institutionId: number) {
  try {
    return await db
      .select({
        id: subscriptions.id,
        institutionId: subscriptions.institutionId,
        studentId: subscriptions.studentId,
        studentName: sql<string>`concat(${students.firstName}, ' ', ${students.lastName})`,
        admissionNumber: students.admissionNumber,
        planName: subscriptions.planName,
        planCode: subscriptions.planCode,
        interval: subscriptions.interval,
        amount: subscriptions.amount,
        status: subscriptions.status,
        nextPaymentDate: subscriptions.nextPaymentDate,
        autoDebitEnabled: subscriptions.autoDebitEnabled,
        createdAt: subscriptions.createdAt,
      })
      .from(subscriptions)
      .leftJoin(students, eq(subscriptions.studentId, students.id))
      .where(eq(subscriptions.institutionId, institutionId))
      .orderBy(desc(subscriptions.id));
  } catch (error) {
    console.error('getSubscriptions error:', error);
    throw new Error('Failed to fetch subscriptions.', { cause: error });
  }
}

export async function createSubscription(
  institutionId: number,
  data: {
    studentId: number;
    planName: string;
    planCode?: string;
    interval: 'monthly' | 'weekly' | 'termly';
    amount: number;
    nextPaymentDate?: string;
  }
) {
  try {
    const code = data.planCode || 'PLN_' + Math.random().toString(36).substring(2, 9);
    const [newSub] = await db
      .insert(subscriptions)
      .values({
        institutionId,
        studentId: data.studentId,
        planName: data.planName,
        planCode: code,
        interval: data.interval,
        amount: data.amount,
        status: 'active',
        nextPaymentDate:
          data.nextPaymentDate ||
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        autoDebitEnabled: true,
      })
      .returning();
    return newSub;
  } catch (error) {
    console.error('createSubscription error:', error);
    throw new Error('Failed to create subscription plan.', { cause: error });
  }
}

export async function updateSubscriptionStatus(
  institutionId: number,
  subscriptionId: number,
  status: 'active' | 'paused' | 'cancelled'
) {
  try {
    const [updated] = await db
      .update(subscriptions)
      .set({ status })
      .where(and(eq(subscriptions.institutionId, institutionId), eq(subscriptions.id, subscriptionId)))
      .returning();
    return updated;
  } catch (error) {
    console.error('updateSubscriptionStatus error:', error);
    throw new Error('Failed to update subscription status.', { cause: error });
  }
}

// Reminders
export async function sendAndLogReminder(
  institutionId: number,
  data: {
    studentId: number;
    channel: 'whatsapp' | 'sms' | 'email';
    recipient: string;
    message: string;
  }
) {
  try {
    const [reminder] = await db
      .insert(paymentReminders)
      .values({
        institutionId,
        studentId: data.studentId,
        channel: data.channel,
        recipient: data.recipient,
        message: data.message,
        status: 'sent',
      })
      .returning();
    return reminder;
  } catch (error) {
    console.error('sendAndLogReminder error:', error);
    throw new Error('Failed to log reminder message.', { cause: error });
  }
}

// Webhook
export async function logAndProcessWebhook(payload: any) {
  try {
    const event = payload.event || 'unknown';
    const reference = payload.data?.reference || payload.data?.trxref;

    const [log] = await db
      .insert(webhookLogs)
      .values({
        event,
        reference,
        payload: JSON.stringify(payload),
        status: 'processed',
      })
      .returning();

    return log;
  } catch (error) {
    console.error('logAndProcessWebhook error:', error);
    throw new Error('Failed to process Paystack webhook.', { cause: error });
  }
}
