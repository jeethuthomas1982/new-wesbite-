const db = require('./db');

const medicines = [
  {
    name: 'Dolo 650',
    generic_name: 'Paracetamol 650mg',
    manufacturer: 'Micro Labs Ltd',
    category: 'Pain Relief',
    description: 'Dolo 650 is used for relief from fever, headache, bodyache, and mild to moderate pain. It contains Paracetamol 650mg as the active ingredient and is one of the most trusted fever relief medicines in India.',
    dosage: '1 tablet every 4-6 hours as needed. Do not exceed 4 tablets in 24 hours.',
    pack_size: '15 Tablets',
    price: 28.91,
    mrp: 30.44,
    discount: 5,
    stock: 500,
    image: 'dolo650.svg',
    prescription_required: 0
  },
  {
    name: 'Crocin Advance 500mg',
    generic_name: 'Paracetamol 500mg',
    manufacturer: 'Haleon India Pvt Ltd',
    category: 'Pain Relief',
    description: 'Crocin Advance provides fast and effective relief from headache, toothache, backache, period pain and cold & flu symptoms. Contains Paracetamol 500mg for pain and fever relief.',
    dosage: '1-2 tablets every 4-6 hours. Maximum 8 tablets in 24 hours.',
    pack_size: '20 Tablets',
    price: 35.91,
    mrp: 37.80,
    discount: 5,
    stock: 400,
    image: 'crocin.svg',
    prescription_required: 0
  },
  {
    name: 'Azithral 500',
    generic_name: 'Azithromycin 500mg',
    manufacturer: 'Alembic Pharmaceuticals',
    category: 'Antibiotics',
    description: 'Azithral 500 is a broad-spectrum antibiotic used to treat a variety of bacterial infections including respiratory tract infections, skin infections, ear infections, and sexually transmitted infections.',
    dosage: '1 tablet once daily for 3-5 days as prescribed by doctor.',
    pack_size: '5 Tablets',
    price: 84.02,
    mrp: 89.50,
    discount: 6,
    stock: 200,
    image: 'azithral.svg',
    prescription_required: 1
  },
  {
    name: 'Allegra 120mg',
    generic_name: 'Fexofenadine 120mg',
    manufacturer: 'Sanofi India Ltd',
    category: 'Allergy',
    description: 'Allegra 120mg provides non-drowsy, 24-hour allergy relief. It effectively treats symptoms of seasonal allergic rhinitis such as sneezing, runny nose, itchy/watery eyes, and skin rashes (urticaria).',
    dosage: '1 tablet once daily. Can be taken with or without food.',
    pack_size: '10 Tablets',
    price: 111.00,
    mrp: 126.00,
    discount: 12,
    stock: 300,
    image: 'allegra.svg',
    prescription_required: 0
  },
  {
    name: 'Pantop 40mg',
    generic_name: 'Pantoprazole 40mg',
    manufacturer: 'Sun Pharmaceutical Industries',
    category: 'Gastrology',
    description: 'Pantop 40 is a proton pump inhibitor (PPI) used to treat gastroesophageal reflux disease (GERD), stomach ulcers, erosive esophagitis, and conditions caused by excess stomach acid like Zollinger-Ellison syndrome.',
    dosage: '1 tablet 30-60 minutes before a meal, once daily or as prescribed.',
    pack_size: '15 Tablets',
    price: 89.28,
    mrp: 96.00,
    discount: 7,
    stock: 350,
    image: 'pantop.svg',
    prescription_required: 1
  },
  {
    name: 'Ecosprin 75mg',
    generic_name: 'Aspirin 75mg',
    manufacturer: 'USV Private Limited',
    category: 'Cardiovascular',
    description: 'Ecosprin 75mg is a low-dose aspirin used as an antiplatelet agent. It helps prevent blood clots, reducing the risk of heart attack and stroke in patients with cardiovascular disease or those who have had a previous heart attack.',
    dosage: '1 tablet daily after food or as directed by physician.',
    pack_size: '14 Tablets',
    price: 19.60,
    mrp: 22.05,
    discount: 11,
    stock: 600,
    image: 'ecosprin.svg',
    prescription_required: 1
  },
  {
    name: 'Glycomet 500mg',
    generic_name: 'Metformin Hydrochloride 500mg',
    manufacturer: 'USV Private Limited',
    category: 'Diabetes',
    description: 'Glycomet 500 is used in the management of Type 2 Diabetes Mellitus. Metformin works by decreasing glucose production in the liver and improving insulin sensitivity, helping control blood sugar levels effectively.',
    dosage: '1 tablet twice daily with meals or as directed by doctor.',
    pack_size: '20 Tablets',
    price: 17.50,
    mrp: 18.50,
    discount: 5,
    stock: 450,
    image: 'glycomet.svg',
    prescription_required: 1
  },
  {
    name: 'Atorva 10mg',
    generic_name: 'Atorvastatin 10mg',
    manufacturer: 'Zydus Cadila',
    category: 'Cardiovascular',
    description: 'Atorva 10 is used to lower cholesterol and triglycerides in the blood. It belongs to the statin class of medicines and reduces the risk of heart attack, stroke, and heart disease when combined with a proper diet.',
    dosage: '1 tablet daily at any time of day. Take at the same time each day.',
    pack_size: '10 Tablets',
    price: 43.00,
    mrp: 48.00,
    discount: 10,
    stock: 300,
    image: 'atorva.svg',
    prescription_required: 1
  },
  {
    name: 'Cetirizine 10mg',
    generic_name: 'Cetirizine Hydrochloride 10mg',
    manufacturer: 'Cipla Ltd',
    category: 'Allergy',
    description: 'Cetirizine 10mg is an antihistamine used to relieve allergy symptoms such as watery eyes, runny nose, itching eyes/nose, sneezing, hives, and itching. It provides relief from seasonal and perennial allergic rhinitis.',
    dosage: '1 tablet once daily in the evening. Take with or without food.',
    pack_size: '10 Tablets',
    price: 22.00,
    mrp: 26.00,
    discount: 15,
    stock: 500,
    image: 'cetirizine.svg',
    prescription_required: 0
  },
  {
    name: 'Omez 20mg',
    generic_name: 'Omeprazole 20mg',
    manufacturer: 'Dr. Reddy\'s Laboratories',
    category: 'Gastrology',
    description: 'Omez 20 capsules contain Omeprazole, a proton pump inhibitor that reduces stomach acid production. It is used to treat heartburn, acid reflux, peptic ulcers, and gastroesophageal reflux disease (GERD).',
    dosage: '1 capsule 30 minutes before meals, once or twice daily as prescribed.',
    pack_size: '15 Capsules',
    price: 60.75,
    mrp: 67.50,
    discount: 10,
    stock: 400,
    image: 'omez.svg',
    prescription_required: 0
  }
];

const existing = db.prepare('SELECT COUNT(*) as count FROM products').get();
if (existing.count === 0) {
  const insert = db.prepare(`
    INSERT INTO products (name, generic_name, manufacturer, category, description, dosage, pack_size, price, mrp, discount, stock, image, prescription_required)
    VALUES (@name, @generic_name, @manufacturer, @category, @description, @dosage, @pack_size, @price, @mrp, @discount, @stock, @image, @prescription_required)
  `);
  const insertMany = db.transaction((items) => {
    for (const item of items) insert.run(item);
  });
  insertMany(medicines);
  console.log('Seeded 10 medicines successfully.');
} else {
  console.log('Products already seeded.');
}
