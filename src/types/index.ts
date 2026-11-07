export type Language = 'en' | 'hi';

export type UserRole = 'patient' | 'admin' | 'phlebotomist';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  age: number;
  bloodGroup: string;
  address: string;
  mfaEnabled: boolean;
  role: UserRole;
}

export interface PatientMember {
  id: string;
  name: string;
  relation: 'Self' | 'Father' | 'Mother' | 'Spouse' | 'Son' | 'Daughter' | 'Other';
  age: number;
  gender: 'male' | 'female' | 'other';
  existingConditions?: string;
}

export interface LabTest {
  id: string;
  code: string;
  nameEn: string;
  nameHi: string;
  category: 'Routine' | 'Diabetes' | 'Cardiology' | 'Thyroid' | 'Kidney' | 'Liver' | 'Vitamins' | 'Full Body' | 'Infection';
  descriptionEn: string;
  descriptionHi: string;
  price: number;
  discountPrice?: number;
  parametersCount: number;
  sampleType: 'Blood (Serum)' | 'Blood (EDTA)' | 'Blood (Fluoride)' | 'Blood & Urine';
  fastingHours: number; // 0 if no fasting required
  tatHours: number; // Turnaround time in hours
  popular?: boolean;
  includedParameters: string[];
}

export type ParameterStatus = 'normal' | 'low' | 'high' | 'critical';

export interface TestParameter {
  id: string;
  name: string;
  value: number;
  unit: string;
  referenceMin: number;
  referenceMax: number;
  status: ParameterStatus;
  interpretation?: string;
}

export interface LabReport {
  id: string;
  bookingId: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  testId: string;
  testNameEn: string;
  testNameHi: string;
  collectionTime: string;
  reportedTime: string;
  sampleBarcode: string;
  sampleType: string;
  referredBy: string;
  pathologistName: string;
  pathologistRegNo: string;
  parameters: TestParameter[];
  overallRemarksEn: string;
  overallRemarksHi: string;
  criticalAlert: boolean;
  isVerified: boolean;
  encryptedHash: string;
  rawCiphertext?: string;
}

export type BookingStatus = 
  | 'booked' 
  | 'collector_assigned' 
  | 'sample_collected' 
  | 'in_lab' 
  | 'report_ready' 
  | 'cancelled';

export interface Booking {
  id: string;
  bookingRef: string;
  patientMember: PatientMember;
  tests: LabTest[];
  totalAmount: number;
  paymentMethod: 'upi' | 'card' | 'netbanking' | 'pay_at_collection';
  paymentStatus: 'paid' | 'pending' | 'failed';
  paymentId?: string;
  scheduledDate: string;
  scheduledTimeSlot: string;
  address: string;
  pincode: string;
  status: BookingStatus;
  phlebotomistName?: string;
  phlebotomistPhone?: string;
  createdAt: string;
  sampleBarcode?: string;
  reportId?: string;
  fastingConfirmed: boolean;
  specialInstructions?: string;
}

export interface HealthMetricPoint {
  date: string;
  sugarFasting?: number;
  hbA1c?: number;
  cholesterol?: number;
  hemoglobin?: number;
  creatinine?: number;
  tsh?: number;
}

export interface AppNotification {
  id: string;
  titleEn: string;
  titleHi: string;
  messageEn: string;
  messageHi: string;
  type: 'reminder' | 'status' | 'report' | 'critical' | 'security';
  timestamp: string;
  read: boolean;
  relatedBookingId?: string;
  relatedReportId?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: 'LOGIN' | 'MFA_VERIFIED' | 'VIEW_REPORT' | 'DOWNLOAD_REPORT' | 'UPLOAD_REPORT' | 'BOOK_TEST' | 'UPDATE_STATUS' | 'DATA_EXPORT' | 'ENCRYPTION_KEY_ROTATE';
  actor: string;
  role: UserRole;
  details: string;
  ipHash: string;
  sha256Checksum: string;
  hipaaCompliant: boolean;
}
