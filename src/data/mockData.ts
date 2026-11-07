import { LabTest, LabReport, Booking, HealthMetricPoint, AppNotification, AuditLogEntry, PatientMember } from '../types';

export const INITIAL_PATIENT_MEMBERS: PatientMember[] = [
  {
    id: 'p-1',
    name: 'Gaurav Giri',
    relation: 'Self',
    age: 32,
    gender: 'male',
    existingConditions: 'Mild Hypertension'
  },
  {
    id: 'p-2',
    name: 'Suresh Giri',
    relation: 'Father',
    age: 63,
    gender: 'male',
    existingConditions: 'Type 2 Diabetes (on Metformin)'
  },
  {
    id: 'p-3',
    name: 'Kamla Giri',
    relation: 'Mother',
    age: 58,
    gender: 'female',
    existingConditions: 'Hypothyroidism'
  }
];

export const LAB_TESTS: LabTest[] = [
  {
    id: 'test-cbc',
    code: 'HEM-01',
    nameEn: 'Complete Blood Count (CBC) with ESR',
    nameHi: 'कम्प्लीट ब्लड काउंट (CBC) एवं ईएसआर',
    category: 'Routine',
    descriptionEn: 'Essential test measuring red blood cells, white blood cells, hemoglobin, and platelets to evaluate overall health and detect infections or anemia.',
    descriptionHi: 'समग्र स्वास्थ्य का आकलन, एनीमिया और संक्रमण की जांच के लिए हीमोग्लोबिन, आरबीसी, डब्ल्यूबीसी और प्लेटलेट्स की व्यापक जांच।',
    price: 349,
    discountPrice: 299,
    parametersCount: 24,
    sampleType: 'Blood (EDTA)',
    fastingHours: 0,
    tatHours: 6,
    popular: true,
    includedParameters: ['Hemoglobin', 'RBC Count', 'PCV/Hematocrit', 'MCV', 'MCH', 'MCHC', 'Total Leucocyte Count (WBC)', 'Neutrophils', 'Lymphocytes', 'Platelet Count', 'ESR']
  },
  {
    id: 'test-full-body',
    code: 'PKG-72',
    nameEn: 'Comprehensive Full Body Health Checkup',
    nameHi: 'सम्पूर्ण शरीर स्वास्थ्य जांच पैकेज (Full Body)',
    category: 'Full Body',
    descriptionEn: 'Gold standard 72+ parameter wellness panel covering CBC, Lipid Profile, Liver (LFT), Kidney (KFT), Thyroid (TSH), Blood Sugar, and Urine routine.',
    descriptionHi: '72 से अधिक पैरामीटर युक्त सर्वोत्तम पैकेज जिसमें सीबीसी, लिपिड, लिवर, किडनी, थायरॉइड, शुगर और यूरिन जांच शामिल है।',
    price: 1999,
    discountPrice: 999,
    parametersCount: 72,
    sampleType: 'Blood & Urine',
    fastingHours: 10,
    tatHours: 12,
    popular: true,
    includedParameters: ['Complete Hemogram', 'Lipid Profile', 'Liver Function (LFT)', 'Kidney Function (KFT)', 'Thyroid TSH', 'Fasting Blood Sugar', 'HbA1c', 'Uric Acid']
  },
  {
    id: 'test-diabetes-hba1c',
    code: 'DIA-04',
    nameEn: 'Diabetes Monitoring (HbA1c + Fasting Sugar)',
    nameHi: 'डायबिटीज निगरानी (HbA1c + फास्टिंग शुगर)',
    category: 'Diabetes',
    descriptionEn: 'Assesses 3-month average blood glucose control and current fasting glucose level for effective diabetic care.',
    descriptionHi: 'पिछले 3 महीनों के औसत ब्लड ग्लूकोज और मौजूदा फास्टिंग शुगर का सटीक मूल्यांकन।',
    price: 599,
    discountPrice: 449,
    parametersCount: 3,
    sampleType: 'Blood (Fluoride)',
    fastingHours: 10,
    tatHours: 6,
    popular: true,
    includedParameters: ['Fasting Blood Glucose', 'HbA1c (Glycated Hemoglobin)', 'Estimated Average Glucose (eAG)']
  },
  {
    id: 'test-lipid',
    code: 'CAR-02',
    nameEn: 'Lipid Profile (Cardiac Risk Marker)',
    nameHi: 'लिपिड प्रोफाइल (हृदय स्वास्थ्य जांच)',
    category: 'Cardiology',
    descriptionEn: 'Measures Total Cholesterol, Good HDL, Bad LDL, VLDL, and Triglycerides to evaluate cardiovascular health and stroke risk.',
    descriptionHi: 'कोलेस्ट्रॉल, एचडीएल, एलडीएल एवं ट्राइग्लिसराइड्स की जांच से दिल की बीमारियों के जोखिम का पता लगाएं।',
    price: 650,
    discountPrice: 499,
    parametersCount: 8,
    sampleType: 'Blood (Serum)',
    fastingHours: 12,
    tatHours: 8,
    popular: true,
    includedParameters: ['Total Cholesterol', 'HDL (Good Cholesterol)', 'LDL (Bad Cholesterol)', 'Triglycerides', 'VLDL Cholesterol', 'TC / HDL Ratio']
  },
  {
    id: 'test-thyroid',
    code: 'THY-01',
    nameEn: 'Thyroid Care Profile (T3, T4, TSH Ultra)',
    nameHi: 'थायरॉइड केयर प्रोफाइल (T3, T4, TSH)',
    category: 'Thyroid',
    descriptionEn: 'Evaluates thyroid gland efficiency to diagnose hyperthyroidism, hypothyroidism, fatigue, and metabolic fluctuations.',
    descriptionHi: 'थायरॉइड ग्रंथि की कार्यप्रणाली, वजन में बदलाव और थकान के कारणों का पता लगाने के लिए आवश्यक जांच।',
    price: 499,
    discountPrice: 399,
    parametersCount: 3,
    sampleType: 'Blood (Serum)',
    fastingHours: 0,
    tatHours: 8,
    popular: false,
    includedParameters: ['Total Triiodothyronine (T3)', 'Total Thyroxine (T4)', 'Thyroid Stimulating Hormone (TSH Ultra)']
  },
  {
    id: 'test-kft',
    code: 'REN-03',
    nameEn: 'Kidney Function Test (KFT / RFT) with Electrolytes',
    nameHi: 'किडनी फंक्शन टेस्ट (KFT) एवं इलेक्ट्रोलाइट्स',
    category: 'Kidney',
    descriptionEn: 'Monitors renal health, filtration rate, blood urea nitrogen (BUN), serum creatinine, uric acid, and sodium/potassium balance.',
    descriptionHi: 'गुर्दे की कार्यक्षमता, क्रिएटिनिन, यूरिया और शरीर में लवणों के संतुलन की जांच।',
    price: 750,
    discountPrice: 599,
    parametersCount: 11,
    sampleType: 'Blood (Serum)',
    fastingHours: 0,
    tatHours: 8,
    popular: false,
    includedParameters: ['Blood Urea Nitrogen', 'Serum Creatinine', 'Uric Acid', 'eGFR', 'Sodium', 'Potassium', 'Chloride', 'BUN / Creatinine Ratio']
  },
  {
    id: 'test-lft',
    code: 'HEP-02',
    nameEn: 'Liver Function Test (LFT) with Enzymes',
    nameHi: 'लिवर फंक्शन टेस्ट (LFT) एवं एंजाइम',
    category: 'Liver',
    descriptionEn: 'Comprehensive screen for liver health, jaundice, fatty liver, checking Bilirubin, SGOT/AST, SGPT/ALT, and protein levels.',
    descriptionHi: 'लिवर की सूजन, पीलिया, फैटी लिवर की जांच हेतु बिलिरुबिन, एसजीओटी और एसजीपीटी एंजाइम की जांच।',
    price: 699,
    discountPrice: 549,
    parametersCount: 12,
    sampleType: 'Blood (Serum)',
    fastingHours: 0,
    tatHours: 8,
    popular: false,
    includedParameters: ['Bilirubin Total', 'Bilirubin Direct', 'SGOT / AST', 'SGPT / ALT', 'Alkaline Phosphatase', 'Total Protein', 'Albumin', 'A/G Ratio']
  },
  {
    id: 'test-vitamins',
    code: 'VIT-02',
    nameEn: 'Vitamin D (25-OH) & Vitamin B12 Combo',
    nameHi: 'विटामिन डी एवं विटामिन बी12 कॉम्बो',
    category: 'Vitamins',
    descriptionEn: 'Essential vitamins for bone density, nerve transmission, mental energy, and immune defense against fatigue.',
    descriptionHi: 'हड्डियों की मजबूती, नसों की कार्यप्रणाली, ऊर्जा और रोग प्रतिरोधक क्षमता के लिए अत्यंत जरूरी जांच।',
    price: 1599,
    discountPrice: 899,
    parametersCount: 2,
    sampleType: 'Blood (Serum)',
    fastingHours: 0,
    tatHours: 12,
    popular: true,
    includedParameters: ['25-Hydroxy Vitamin D', 'Vitamin B12 (Cyanocobalamin)']
  }
];

export const INITIAL_REPORTS: LabReport[] = [
  {
    id: 'rep-8842',
    bookingId: 'bk-1001',
    patientId: 'p-1',
    patientName: 'Gaurav Giri',
    patientAge: 32,
    patientGender: 'Male',
    testId: 'test-cbc',
    testNameEn: 'Complete Blood Count (CBC) with ESR',
    testNameHi: 'कम्प्लीट ब्लड काउंट (CBC) एवं ईएसआर',
    collectionTime: '06 Nov 2026, 07:15 AM',
    reportedTime: '06 Nov 2026, 01:30 PM',
    sampleBarcode: 'AR-994821',
    sampleType: 'EDTA Whole Blood',
    referredBy: 'Dr. Anand Verma, MD (Internal Medicine)',
    pathologistName: 'Dr. Sunita Kulkarni',
    pathologistRegNo: 'MCI-64920/DMC',
    overallRemarksEn: 'Hemogram parameters are largely within biological reference ranges. Mild neutrophilic shift noted, clinically correlate with recent minor viral exposure.',
    overallRemarksHi: 'हेमोग्राम पैरामीटर अधिकांशतः सामान्य जैविक सीमा में हैं। हाल के हल्के संक्रमण के प्रभाव के लिए क्लिनिकल परामर्श लें।',
    criticalAlert: false,
    isVerified: true,
    encryptedHash: '8f7a93c4e12d59b708e33f21a48c6b907e15bf90132a76d8b940e7f1c65d9321',
    rawCiphertext: 'U2FsdGVkX19xN48M10bT9qZa8e...[AES-256 GCM SEALED RECORD]',
    parameters: [
      {
        id: 'param-1',
        name: 'Hemoglobin (Hb)',
        value: 14.8,
        unit: 'g/dL',
        referenceMin: 13.0,
        referenceMax: 17.0,
        status: 'normal',
        interpretation: 'Optimum oxygen carrying capacity.'
      },
      {
        id: 'param-2',
        name: 'Total Leukocyte Count (WBC)',
        value: 7800,
        unit: 'cells/cu.mm',
        referenceMin: 4000,
        referenceMax: 11000,
        status: 'normal',
        interpretation: 'Normal immune cell count.'
      },
      {
        id: 'param-3',
        name: 'Platelet Count',
        value: 245000,
        unit: 'cells/cu.mm',
        referenceMin: 150000,
        referenceMax: 450000,
        status: 'normal',
        interpretation: 'Normal coagulation status.'
      },
      {
        id: 'param-4',
        name: 'Neutrophils',
        value: 68,
        unit: '%',
        referenceMin: 40,
        referenceMax: 70,
        status: 'normal'
      },
      {
        id: 'param-5',
        name: 'Lymphocytes',
        value: 26,
        unit: '%',
        referenceMin: 20,
        referenceMax: 45,
        status: 'normal'
      },
      {
        id: 'param-6',
        name: 'Packed Cell Volume (PCV)',
        value: 43.5,
        unit: '%',
        referenceMin: 40,
        referenceMax: 50,
        status: 'normal'
      },
      {
        id: 'param-7',
        name: 'ESR (Westergren Method)',
        value: 12,
        unit: 'mm/1st hr',
        referenceMin: 0,
        referenceMax: 15,
        status: 'normal'
      }
    ]
  },
  {
    id: 'rep-7731',
    bookingId: 'bk-1002',
    patientId: 'p-2',
    patientName: 'Suresh Giri',
    patientAge: 63,
    patientGender: 'Male',
    testId: 'test-diabetes-hba1c',
    testNameEn: 'Diabetes Monitoring (HbA1c + Fasting Sugar)',
    testNameHi: 'डायबिटीज निगरानी (HbA1c + फास्टिंग शुगर)',
    collectionTime: '04 Nov 2026, 06:45 AM',
    reportedTime: '04 Nov 2026, 11:20 AM',
    sampleBarcode: 'AR-773180',
    sampleType: 'Fluoride Plasma & EDTA',
    referredBy: 'Dr. Anand Verma, MD (Internal Medicine)',
    pathologistName: 'Dr. Rajesh Sharma',
    pathologistRegNo: 'MCI-48291/DMC',
    overallRemarksEn: 'CRITICAL VALUE ALERT: Fasting plasma glucose and HbA1c indicate suboptimal glycemic control. Patient advised to contact treating diabetologist for medication dosage review.',
    overallRemarksHi: 'गंभीर चेतावनी: फास्टिंग ब्लड शुगर एवं HbA1c स्तर अधिक पाया गया है। कृपया तुरंत अपने चिकित्सक से परामर्श कर दवा की खुराक की समीक्षा कराएं।',
    criticalAlert: true,
    isVerified: true,
    encryptedHash: '4e99f11a8b27c9d06e21b8f44d18723c0b118a9947ce2e49c90bfa201bcf5592',
    rawCiphertext: 'U2FsdGVkX1+vG83eWkK309aLm...[AES-256 GCM SEALED RECORD]',
    parameters: [
      {
        id: 'param-dia-1',
        name: 'Fasting Blood Glucose',
        value: 168,
        unit: 'mg/dL',
        referenceMin: 70,
        referenceMax: 100,
        status: 'critical',
        interpretation: 'Significantly elevated fasting level (>126 mg/dL diagnostic threshold).'
      },
      {
        id: 'param-dia-2',
        name: 'HbA1c (Glycated Hemoglobin)',
        value: 8.4,
        unit: '%',
        referenceMin: 4.0,
        referenceMax: 5.6,
        status: 'high',
        interpretation: 'Poor glycemic control (>8.0% signifies high cardiovascular risk).'
      },
      {
        id: 'param-dia-3',
        name: 'Estimated Average Glucose (eAG)',
        value: 194,
        unit: 'mg/dL',
        referenceMin: 90,
        referenceMax: 120,
        status: 'high',
        interpretation: 'Reflects higher average serum glucose over preceding 90 days.'
      }
    ]
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bk-1001',
    bookingRef: 'AAR-2026-9041',
    patientMember: INITIAL_PATIENT_MEMBERS[0],
    tests: [LAB_TESTS[0]],
    totalAmount: 299,
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    paymentId: 'UPI-938210948@axis',
    scheduledDate: '2026-11-06',
    scheduledTimeSlot: '07:00 AM - 08:00 AM',
    address: 'B-402, Green Valley Heights, Sector 62',
    pincode: '201301',
    status: 'report_ready',
    phlebotomistName: 'Ramesh Singh (Certified Phlebotomist)',
    phlebotomistPhone: '+91 98765 43210',
    createdAt: '2026-11-05 18:30',
    sampleBarcode: 'AR-994821',
    reportId: 'rep-8842',
    fastingConfirmed: true,
    specialInstructions: 'Ring bell twice, patient ready with fasting.'
  },
  {
    id: 'bk-1002',
    bookingRef: 'AAR-2026-8812',
    patientMember: INITIAL_PATIENT_MEMBERS[1],
    tests: [LAB_TESTS[2]],
    totalAmount: 449,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    paymentId: 'TXN_CARD_773192',
    scheduledDate: '2026-11-04',
    scheduledTimeSlot: '06:30 AM - 07:30 AM',
    address: 'B-402, Green Valley Heights, Sector 62',
    pincode: '201301',
    status: 'report_ready',
    phlebotomistName: 'Sunil Verma',
    phlebotomistPhone: '+91 98112 34567',
    createdAt: '2026-11-03 20:10',
    sampleBarcode: 'AR-773180',
    reportId: 'rep-7731',
    fastingConfirmed: true,
    specialInstructions: 'Senior citizen, gentle vein draw needed.'
  },
  {
    id: 'bk-1003',
    bookingRef: 'AAR-2026-9934',
    patientMember: INITIAL_PATIENT_MEMBERS[2],
    tests: [LAB_TESTS[4], LAB_TESTS[7]],
    totalAmount: 1298,
    paymentMethod: 'pay_at_collection',
    paymentStatus: 'pending',
    scheduledDate: '2026-11-07',
    scheduledTimeSlot: '08:00 AM - 09:00 AM',
    address: 'B-402, Green Valley Heights, Sector 62',
    pincode: '201301',
    status: 'collector_assigned',
    phlebotomistName: 'Deepak Kumar',
    phlebotomistPhone: '+91 97118 90123',
    createdAt: '2026-11-06 09:15',
    fastingConfirmed: true,
    specialInstructions: 'Carry portable card swipe or UPI QR scanner.'
  }
];

export const HEALTH_TRENDS_DATA: HealthMetricPoint[] = [
  { date: '10 May 2026', sugarFasting: 92, hbA1c: 5.4, cholesterol: 185, hemoglobin: 14.2, creatinine: 0.9, tsh: 2.1 },
  { date: '15 Jul 2026', sugarFasting: 98, hbA1c: 5.5, cholesterol: 192, hemoglobin: 14.5, creatinine: 0.95, tsh: 2.3 },
  { date: '28 Aug 2026', sugarFasting: 104, hbA1c: 5.7, cholesterol: 210, hemoglobin: 14.4, creatinine: 1.0, tsh: 2.0 },
  { date: '04 Oct 2026', sugarFasting: 96, hbA1c: 5.4, cholesterol: 195, hemoglobin: 14.7, creatinine: 0.92, tsh: 2.2 },
  { date: '06 Nov 2026', sugarFasting: 94, hbA1c: 5.3, cholesterol: 188, hemoglobin: 14.8, creatinine: 0.89, tsh: 2.15 }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    titleEn: 'Report Ready for Download',
    titleHi: 'आपकी जांच रिपोर्ट तैयार है',
    messageEn: 'Your Complete Blood Count (CBC) report is verified by Dr. Sunita Kulkarni and available for secure download.',
    messageHi: 'कम्प्लीट ब्लड काउंट (CBC) रिपोर्ट डॉ. सुनीता कुलकर्णी द्वारा हस्ताक्षरित है और डाउनलोड हेतु उपलब्ध है।',
    type: 'report',
    timestamp: 'Today, 01:30 PM',
    read: false,
    relatedReportId: 'rep-8842',
    relatedBookingId: 'bk-1001'
  },
  {
    id: 'notif-2',
    titleEn: 'Critical Glucose Alert: Suresh Giri',
    titleHi: 'गंभीर स्वास्थ्य अलर्ट: सुरेश गिरि',
    messageEn: 'Fasting glucose was 168 mg/dL. Our medical desk flagged this for immediate doctor review.',
    messageHi: 'फास्टिंग ग्लूकोज 168 mg/dL पाया गया। तुरंत अपने डॉक्टर से संपर्क करें।',
    type: 'critical',
    timestamp: '04 Nov 2026, 11:22 AM',
    read: false,
    relatedReportId: 'rep-7731',
    relatedBookingId: 'bk-1002'
  },
  {
    id: 'notif-3',
    titleEn: 'Sample Collector Assigned for Tomorrow',
    titleHi: 'कल के लिए सैंपल कलेक्टर आवंटित',
    messageEn: 'Phlebotomist Deepak Kumar (+91 97118 90123) is assigned for pickup between 08:00 AM - 09:00 AM.',
    messageHi: 'फ्लेबोटोमिस्ट दीपक कुमार को सुबह 8:00 से 9:00 के बीच सैंपल लेने के लिए आवंटित किया गया है।',
    type: 'reminder',
    timestamp: 'Today, 09:16 AM',
    read: true,
    relatedBookingId: 'bk-1003'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-901',
    timestamp: '2026-11-06 13:30:15 UTC',
    action: 'UPLOAD_REPORT',
    actor: 'Dr. Sunita Kulkarni (MD Path)',
    role: 'admin',
    details: 'Digital signature applied to CBC Report #rep-8842 with 24 parameters verified',
    ipHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    sha256Checksum: '8f7a93c4e12d59b708e33f21a48c6b907e15bf90132a76d8b940e7f1c65d9321',
    hipaaCompliant: true
  },
  {
    id: 'aud-902',
    timestamp: '2026-11-06 09:15:40 UTC',
    action: 'BOOK_TEST',
    actor: 'Gaurav Giri (Patient)',
    role: 'patient',
    details: 'Booked home collection #bk-1003 (Thyroid + Vitamin D/B12 Combo) for Mother',
    ipHash: '7a13c901e1295b90f4c8996fa127ae41e4649b934ca495991b7852b855909121',
    sha256Checksum: 'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0',
    hipaaCompliant: true
  },
  {
    id: 'aud-903',
    timestamp: '2026-11-06 07:15:22 UTC',
    action: 'UPDATE_STATUS',
    actor: 'Ramesh Singh (Phlebotomist)',
    role: 'phlebotomist',
    details: 'Sample collected, sealed in cold-chain tube #AR-994821 at patient doorstep',
    ipHash: '6b42c901e1295b90f4c8996fa127ae41e4649b934ca495991b7852b855909452',
    sha256Checksum: 'c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef01234',
    hipaaCompliant: true
  },
  {
    id: 'aud-904',
    timestamp: '2026-11-05 18:30:05 UTC',
    action: 'MFA_VERIFIED',
    actor: 'Gaurav Giri',
    role: 'patient',
    details: 'Successful 2FA SMS token authentication from verified device',
    ipHash: '7a13c901e1295b90f4c8996fa127ae41e4649b934ca495991b7852b855909121',
    sha256Checksum: 'e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef012345678',
    hipaaCompliant: true
  }
];
