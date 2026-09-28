'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { HiLocationMarker, HiArrowLeft, HiCheck, HiCalendar, HiOfficeBuilding } from 'react-icons/hi';
import { internationalClients, nationalClients } from '@/lib/data/clients';

// Data structures for 11 Focus Areas (Section 1)
interface CompletedProject {
  sn: number;
  name: string;
  client: string;
  year: string;
  remarks: string;
  image: string;
  bullets?: string[];
}

interface FocusArea {
  id: string;
  number: string;
  title: string;
  scope: string[];
  featuredProject: {
    title: string;
    client: string;
    year: string;
    location?: string;
    image: string;
    description: string;
  };
}

const buildingDesignProjects: CompletedProject[] = [
  {
    sn: 1,
    name: 'Detail Seismic Vulnerability Assessment of 523 Numbers of Public School Buildings of Nepal, Phase II, Gorkha',
    client: 'World Bank Group',
    year: 'N/A',
    remarks: 'Completed',
    image: '/images/projects/building-design-major-1.jpg'
  },
  {
    sn: 2,
    name: 'Detail Design, Drawing and Cost Estimate of Bhaktapur Cancer Hospital, Patan Multiple Campus, Kanya Mandir H.S. School, Shree Adarsha H.S. School, Padmodaya H.S. School',
    client: 'Tzu-Chi Foundation, Taiwan',
    year: 'N/A',
    remarks: 'Completed',
    image: '/images/projects/building-design-major-2.jpg',
    bullets: [
      'Bhaktapur Cancer Hospital, Bhaktapur (1 Block)',
      'Patan Multiple Campus, Lalitpur (4 Blocks)',
      'Kanya Mandir H.S. School, Nhyokha, Kathmandu (1 Block)',
      'Shree Adarsha H.S. School, Bhadrabas, Kathmandu (1 Block)',
      'Padmodaya H.S. School, Pradarsani Marg, Kathmandu (1 Block)'
    ]
  },
  {
    sn: 3,
    name: 'Detail Architectural/Engineering Design and Drawing of registrar TU buildings (VC Office, Rector Office, Admin, Dean Offices, Library, exam controller etc.)',
    client: 'Office of the Registrar, T.U., Kirtipur',
    year: 'N/A',
    remarks: 'Completed',
    image: '/images/projects/building-design-major-3.jpg',
    bullets: [
      'Vice Chancellor Office Building',
      'Rector Office Building',
      'Administration Office Building',
      'Faculty of Humanities Dean’s Office Building',
      'Faculty of Science and Technology Dean’s Building',
      'Faculty of Management Dean’s Building',
      'Faculty of Law Dean’s Building',
      'Central Library Building',
      'Service Commission Building',
      'Exam Controller Building',
      'Legal Research Center, Faculty of Law Department',
      'Academic Building of Nepal Law Campus',
      'Agro-Bio Material Research Laboratory Building'
    ]
  },
  {
    sn: 4,
    name: 'Master Plan, Soil Test, Detail Design, Estimate and Construction Supervision of Office Building for Nepal Health Professional Council & Nepal Nursing Council at Bansbari, Kathmandu',
    client: 'Nepal Health Professional Council & Nepal Nursing Council at Bansbari, Kathmandu',
    year: 'N/A',
    remarks: 'Completed',
    image: '/images/projects/building-design-major-4.jpg'
  },
  {
    sn: 5,
    name: 'Detail Structural Redesign, BOQ and Cost Estimate of Office Building at Chabahil',
    client: 'Nepal Telecommunication Authority, Tripureshwor',
    year: 'N/A',
    remarks: 'Completed',
    image: '/images/projects/building-design-major-5.jpg'
  },
  {
    sn: 6,
    name: 'Consultancy services for civil works at T.U., IOM, Patan Campus, Amrit Campus, Saraswati Campus, Shankar Dev, Trichandra etc.',
    client: 'Consultancy Services for Civil Works',
    year: 'N/A',
    remarks: 'Completed',
    image: '/images/projects/building-design-major-6.jpg',
    bullets: [
      'T.U. Kirtipur',
      'I.O.M. Teaching Hospital, Maharajgunj, Kathmandu',
      'IOM, Maharajgunj Medicine Campus at Maharajgunj',
      'T.U. Patan Campus, Patan Dhoka',
      'T.U. Amrit Campus, Lainchour',
      'T.U. Saraswati Campus, Lainchour',
      'T.U. Shankar Dev Campus, Putalisadak',
      'IOM, Nursing College, Maharajgunj, Kathmandu',
      'T.U. Tri-Chandra College'
    ]
  },
  {
    sn: 7,
    name: 'Detail A/E Design, Drawing of District Education Office Building at Okhaldhunga',
    client: 'Government of Nepal Ministry of Education and Sports, Department of Education (DOE), Sanothimi, Bhaktapur',
    year: 'Jan, 2014',
    remarks: 'Completed',
    image: '/images/projects/building-design-1.jpg'
  },
  {
    sn: 8,
    name: 'Details Architect & Structure Design of Library Building at Nursing College, Maharajgunj, Kathmandu',
    client: 'IOM, Nursing College, Maharajgunj, Kathmandu',
    year: 'Nov, 2014',
    remarks: 'Completed',
    image: '/images/projects/building-design-2.jpg'
  },
  {
    sn: 9,
    name: 'Detail Design, Drawing, Cost Estimate & Construction Supervision of Hospital Building',
    client: 'Hospital Building, New Spinal Cord Injury Ward at INF Green Pastures Hospital, Pokhara',
    year: 'Jan, 2013',
    remarks: 'Completed',
    image: '/images/projects/building-design-3.jpg'
  },
  {
    sn: 10,
    name: 'A/E Design, Drawing, Estimation of Commercial Building Complex at Bhairahawa',
    client: 'Nepal Telecom, Central Office, Bhadrakali, Kathmandu',
    year: 'Oct, 2012',
    remarks: 'Completed',
    image: '/images/projects/building-design-4.jpg'
  },
  {
    sn: 11,
    name: 'A/E Design, Drawing, Estimation & Costing Works of Hospital Building at Birtamode, Jhapa',
    client: 'B&C Medical College Teaching Hospital & Research Center Pvt. Ltd., Anarmani-3, Birtamode, Jhapa',
    year: 'Aug, 2012',
    remarks: 'Completed',
    image: '/images/projects/building-design-5.jpg'
  },
  {
    sn: 12,
    name: 'A/E Design, Drawing, Estimate & Costing Works of Hospital Building at Dhapasi, Basundhara, Ring Road',
    client: 'Kantipur Dental College Teaching Hospital & Research Center, Dhapasi, Basundhara, Ring Road',
    year: 'June, 2012',
    remarks: 'Completed',
    image: '/images/projects/building-design-6.jpg'
  },
  {
    sn: 13,
    name: 'A/E Design, Drawing, Estimate of OPD & Extension of PG Residential Building at Teaching Hospital Area',
    client: 'T.U., IOM, B.P. Koirala Lions Center of Ophthalmic Studies, Maharajgunj',
    year: 'Sept, 2012',
    remarks: 'Completed',
    image: '/images/projects/building-design-7.jpg'
  },
  {
    sn: 14,
    name: 'A/E Design, Drawing & Estimate of Office Building & Proposed International Hostel Building at Maharajgunj',
    client: 'IOM, Maharajgunj Medicine Campus at Maharajgunj',
    year: 'Dec, 2011',
    remarks: 'Completed',
    image: '/images/projects/building-design-8.jpg'
  },
  {
    sn: 15,
    name: 'Road Design, Building Design, Estimate & Supervision at Baluwatar',
    client: 'Nepal Rastra Bank, Baluwatar',
    year: 'Oct, 2011',
    remarks: 'Completed',
    image: '/images/projects/building-design-9.jpg'
  },
  {
    sn: 16,
    name: 'Detail Survey, Design and Construction Supervision of Hotel Building Construction Works',
    client: 'Government of Nepal, Nepal Academy of Tourism & Hotel Management, Rabibhawan',
    year: 'Sept, 2010',
    remarks: 'Completed',
    image: '/images/projects/building-design-10.jpg'
  },
  {
    sn: 17,
    name: 'Soil Test, Detail A/E Design and Construction Supervision for Asali Mandap Business Building at Naxal',
    client: "Guardian's Co-operative Society Ltd. (Asali), Naxal",
    year: 'Feb, 2009',
    remarks: 'Completed',
    image: '/images/projects/building-design-11.jpg'
  },
  {
    sn: 18,
    name: 'Detail Structure, A/E Design, Soil Test and Cost Estimate for Campus Building Construction Work at Mitrapark',
    client: 'Pashupati Multiple Campus, Chabahil, Mitrapark',
    year: 'Jan, 2008',
    remarks: 'Completed',
    image: '/images/projects/building-design-12.jpg'
  },
  {
    sn: 19,
    name: 'Soil Test, Detail A/E Design and Construction Supervision for Office & Business Complex at Lazimpat',
    client: 'Village Travel & Tours (P) Ltd., Lazimpat',
    year: 'March, 2008',
    remarks: 'Completed',
    image: '/images/projects/building-design-13.jpg'
  },
  {
    sn: 20,
    name: 'Rubb-Hall Design & Supervision Works',
    client: 'UN World Food Programme',
    year: 'Dec, 2007',
    remarks: 'Completed',
    image: '/images/projects/building-design-14.jpg'
  },
  {
    sn: 21,
    name: 'Building for Handicapped at Kathmandu',
    client: 'New Life Handicapped and 24 Hours Prayer Ministry',
    year: 'June, 2005',
    remarks: 'Completed',
    image: '/images/projects/building-design-15.jpg'
  }
];

const interiorDesignProjects: CompletedProject[] = [
  {
    sn: 1,
    name: 'Interior Design Works & Cost Estimate of Ministry of Education, Singhdurbar',
    client: 'Government of Nepal, Ministry of Urban Development Singhdurbar Secretariat Re-construction Committee Board',
    year: 'April, 2012',
    remarks: 'Completed',
    image: '/images/projects/interior-design-1.jpg'
  },
  {
    sn: 2,
    name: 'Interior Design Works & Cost Estimate of Ministry of Local Development, Singhdurbar',
    client: 'Government of Nepal, Ministry of Urban Development Singhdurbar Secretariat Re-construction Committee Board',
    year: 'April, 2012',
    remarks: 'Completed',
    image: '/images/projects/interior-design-2.jpg'
  },
  {
    sn: 3,
    name: 'Interior Design of Office Building',
    client: 'Nepal Rastra Bank, Baluwatar',
    year: 'July, 2011',
    remarks: 'Completed',
    image: '/images/projects/interior-design-3.jpg'
  },
  {
    sn: 4,
    name: 'Detail Interior Design of International Meeting Hall & Supervision Works',
    client: 'Ministry of Foreign Affairs, Kathmandu, Nepal',
    year: 'Jan, 2010',
    remarks: 'Completed',
    image: '/images/projects/interior-design-4.jpg'
  },
  {
    sn: 5,
    name: 'Interior Design & Furniture Layout and Design for Manmohan Cardiothoracic Vascular and Transplant Center & ENT Building at Teaching Hospital Premises',
    client: 'Teaching Hospital at Maharajgunj',
    year: 'March, 2007',
    remarks: 'Completed',
    image: '/images/projects/interior-design-5.jpg'
  }
];

const masterPlanProjects: CompletedProject[] = [
  {
    sn: 1,
    name: 'Preparation of Physical Infrastructure Master Plan Design & Drawing at Thapathali Branch',
    client: 'Nepal Rastra Bank, General Services Department, Baluwatar, Kathmandu',
    year: 'March, 2014',
    remarks: 'Completed',
    image: '/images/projects/master-plan-1.jpg'
  },
  {
    sn: 2,
    name: 'Master Plan, Landscaping & Design, Drawing & Estimate of Academic Building',
    client: 'T.U. IOM, Ayurveda Campus at Kirtipur',
    year: 'Jan, 2013',
    remarks: 'Completed',
    image: '/images/projects/master-plan-2.jpg'
  },
  {
    sn: 3,
    name: 'Master Plan, Soil Test, Detail Design, Estimate and Construction Supervision of Office Building for Nepal Health Professional Council & Nepal Nursing Council at Bansbari, Kathmandu',
    client: 'Nepal Health Professional Council & Nepal Nursing Council at Bansbari, Kathmandu',
    year: 'Dec, 2013',
    remarks: 'Supervision',
    image: '/images/projects/master-plan-3.jpg'
  },
  {
    sn: 4,
    name: 'Master Plan Land & Building, Structure Design, Soil Test, Detail Design, Drawing and Estimation for Commercial Complex Building Construction at Baneshwor',
    client: 'Citizen Investment Trust, Baneshwor',
    year: 'Sept, 2012',
    remarks: 'Completed',
    image: '/images/projects/master-plan-4.jpg'
  },
  {
    sn: 5,
    name: 'Master Plan Land & Building, Detail Structure & A/E Design of Office Complex Building at Chabahil',
    client: 'Nepal Telecommunication Authority, Tripureshwor',
    year: 'Sept, 2012',
    remarks: 'Completed',
    image: '/images/projects/master-plan-5.jpg'
  },
  {
    sn: 6,
    name: 'Conceptual Design, Master Plan of NIDC Land at Kathmandu & Pokhara',
    client: 'Nepal Industrial Development Corporation Ltd., Durbar Marg, Kathmandu',
    year: 'Jan, 2011',
    remarks: 'Completed',
    image: '/images/projects/master-plan-6.jpg'
  },
  {
    sn: 7,
    name: 'Master Plan, Architectural & Engineering Design, Drawing of District Administration Office, Khotang',
    client: 'Department of Urban Development & Building Construction',
    year: 'Oct, 2007',
    remarks: 'Completed',
    image: '/images/projects/master-plan-7.jpg'
  },
  {
    sn: 8,
    name: 'Master Plan, Architectural & Engineering Design of District Jail, Khotang',
    client: 'Department of Urban Development & Building Construction',
    year: 'Oct, 2007',
    remarks: 'Completed',
    image: '/images/projects/master-plan-8.jpg'
  },
  {
    sn: 9,
    name: 'Master Plan, Architectural & Engineering Design of Land Revenue Office, Dolakha',
    client: 'Department of Urban Development & Building Construction',
    year: 'Oct, 2007',
    remarks: 'Completed',
    image: '/images/projects/master-plan-9.jpg'
  },
  {
    sn: 10,
    name: 'Master Plan, Architectural & Engineering Design of District Police Office, Arghakhachi',
    client: 'Department of Urban Development & Building Construction',
    year: 'Oct, 2007',
    remarks: 'Completed',
    image: '/images/projects/master-plan-10.jpg'
  },
  {
    sn: 11,
    name: 'Master Plan, Survey, Existing & New System of Sanitary & Drainage System inside Teaching Hospital',
    client: 'IOM, Office of the Dean, Maharajgunj',
    year: 'July, 2005',
    remarks: 'Completed',
    image: '/images/projects/master-plan-11.jpg'
  }
];

const hydropowerProjects: CompletedProject[] = [
  {
    sn: 1,
    name: 'Middle Gaddi Gad Hydropower, Doti, Detail Design & Estimate',
    client: 'Triyog Energy & Development (P) Ltd., Maharajgunj',
    year: 'Oct, 2009',
    remarks: 'Completed',
    image: '/images/projects/hydropower-1.jpg'
  },
  {
    sn: 2,
    name: 'Nayam Nayam Khola Hydropower Survey, Design, Drawing & Estimate',
    client: 'Nayam Nayam (Upper) Khola Hydropower Project, Rasuwa',
    year: 'Nov, 2011',
    remarks: 'Completed',
    image: '/images/projects/hydropower-2.jpg'
  },
  {
    sn: 3,
    name: 'Naubise Khola Small Hydropower, Naubise, Detail Survey, Design, Drawing & Estimate',
    client: 'Shreerup Hydropower Project, Kathmandu',
    year: 'July, 2013',
    remarks: 'Completed',
    image: '/images/projects/hydropower-3.jpg'
  }
];

const technicalAuditProjects: CompletedProject[] = [
  {
    sn: 1,
    name: 'Ilaka Prahari Karyalaya (APO), Bhandara, Chitwan',
    client: 'District Police Office, Chitwan',
    year: '25th July, 2013',
    remarks: 'Completed',
    image: '/images/projects/technical-audit-1.jpg'
  },
  {
    sn: 2,
    name: 'Prahari Chouki (PP), Maidi, Dhading',
    client: 'District Police Office, Dhading',
    year: '25th July, 2013',
    remarks: 'Completed',
    image: '/images/projects/technical-audit-2.jpg'
  },
  {
    sn: 3,
    name: 'Khajuri Sub-Health Post Building, Dhanusha',
    client: 'DUDBC, Janakpur',
    year: '25th July, 2013',
    remarks: 'Completed',
    image: '/images/projects/technical-audit-3.jpg'
  },
  {
    sn: 4,
    name: 'Khajurgachhi Primary Health Center Building, Jhapa',
    client: 'DUDBC, Ilam',
    year: '25th July, 2013',
    remarks: 'Completed',
    image: '/images/projects/technical-audit-4.jpg'
  },
  {
    sn: 5,
    name: 'Technical Audit of Contract Package NVC/TA-01, 068/069 District Administration Office at Dhangadhi',
    client: 'DUDBC, Kailali',
    year: 'July, 2012',
    remarks: 'Completed',
    image: '/images/projects/technical-audit-5.jpg'
  },
  {
    sn: 6,
    name: 'Technical Audit of Contract Package NVC/TA-01, 068/069 Kailali Bhansar Karyalaya at Dhangadhi',
    client: 'DUDBC, Kailali',
    year: 'July, 2012',
    remarks: 'Completed',
    image: '/images/projects/technical-audit-6.jpg'
  },
  {
    sn: 7,
    name: 'Technical Audit of School Buildings: i) Shree Saileshwori Ma.Vi., Behada, ii) Shree Saraswoti Ma.Vi., Sehari, Beladipur, iii) Shree Rastriya Ma.Vi., Khelad, iv) Shree Rastriya Ma.Vi., Basauti, v) Shree Laxmi Ma.Vi., Udasipur, Kailali',
    client: 'Department of Education, Sanothimi, District Education Office, Kailali',
    year: '2013',
    remarks: 'Final Report Submitted',
    image: '/images/projects/technical-audit-7.jpg'
  }
];

const valuationProjects: CompletedProject[] = [
  {
    sn: 1,
    name: 'Valuation of Embassy of Denmark',
    client: 'Embassy of Denmark',
    year: '2016',
    remarks: 'Completed',
    image: '/images/projects/valuation-1.jpg'
  },
  {
    sn: 2,
    name: 'Valuation of Housing Building & Land',
    client: 'Royal-Rara-Api Joint Merger Committee Secretariat, Sita Kuti, Durbar Marg, Kathmandu',
    year: '2013',
    remarks: 'Completed',
    image: '/images/projects/valuation-2.jpg'
  },
  {
    sn: 3,
    name: 'Valuation of Housing Building & Land',
    client: 'Siddhartha Development Bank Ltd. & Public Development Bank Ltd. Joint Merger Committee Secretariat',
    year: '2013',
    remarks: 'Completed',
    image: '/images/projects/valuation-3.jpg'
  },
  {
    sn: 4,
    name: 'Valuation of Housing Building & Land',
    client: 'Karmachari Sanchaya Kosh, Pulchowk',
    year: '2015',
    remarks: 'Completed',
    image: '/images/projects/valuation-4.jpg'
  },
  {
    sn: 5,
    name: 'Valuation of Housing Building & Land',
    client: 'Bank of Kathmandu, Kamaladi',
    year: '2015',
    remarks: 'Completed',
    image: '/images/projects/valuation-5.jpg'
  },
  {
    sn: 6,
    name: 'Valuation of Housing Building & Land',
    client: 'Agriculture Development Bank, Kathmandu',
    year: '2015',
    remarks: 'Completed',
    image: '/images/projects/valuation-6.jpg'
  },
  {
    sn: 7,
    name: 'Valuation of Housing Building & Land',
    client: 'Rastriya Banijya Bank, Kathmandu',
    year: '2015',
    remarks: 'Completed',
    image: '/images/projects/valuation-7.jpg'
  },
  {
    sn: 8,
    name: 'Valuation of Housing Building & Land',
    client: 'Citizens Bank International, Kamaladi, Kathmandu',
    year: '2014',
    remarks: 'Completed',
    image: '/images/projects/valuation-8.jpg'
  },
  {
    sn: 9,
    name: 'Valuation of Housing Building & Land',
    client: 'Bright Development Bank, Panauti, Kavre, Nepal',
    year: '2013',
    remarks: 'Completed',
    image: '/images/projects/valuation-9.jpg'
  },
  {
    sn: 10,
    name: 'Valuation of Housing Building & Land',
    client: 'Nepal Housing Development Finance Company Ltd., New Baneshwor',
    year: '2013',
    remarks: 'Completed',
    image: '/images/projects/valuation-10.jpg'
  },
  {
    sn: 11,
    name: 'Valuation of Housing Building & Land',
    client: 'NCC Bank, NB Building, Bagbazar',
    year: '2015',
    remarks: 'Completed',
    image: '/images/projects/valuation-11.jpg'
  },
  {
    sn: 12,
    name: 'Valuation of Housing, Building & Land',
    client: 'NIDC, Darbar Marg, Kathmandu',
    year: '2015',
    remarks: 'Completed',
    image: '/images/projects/valuation-12.jpg'
  }
];


const focusAreas: FocusArea[] = [
  {
    id: 'building-design',
    number: 'Focus Area 01',
    title: 'Building Design',
    scope: [
      'Architectural Design & Space Planning',
      'Structural Engineering & Seismic Design',
      'Electrical, Plumbing & Sanitary Design',
      'HVAC & Fire Fighting Systems Design',
      'Municipal Approval Drawings & Support',
      'Preparation of Bill of Quantities (BOQ) & Estimates',
      'Construction Supervision & Quality Control',
      'Renovation & Structural Retrofitting Studies'
    ],
    featuredProject: {
      title: 'District Education Office Building at Okhaldhunga',
      client: 'Government of Nepal Ministry of Education and Sports',
      year: '2014',
      image: '/images/projects/building-design-1.jpg',
      description: 'Detail architectural/engineering design and drawing works for public office facility.'
    }
  },
  {
    id: 'interior-design',
    number: 'Focus Area 02',
    title: 'Interior Design',
    scope: [
      'Concept Development & Space Optimization',
      '3D Rendering & Material Selection',
      'Lighting, Acoustic & Ceiling Layouts',
      'Furniture & Fixtures Design (FF&E)',
      'Detailed Joinery & Fit-out Working Drawings',
      'Supervision of Interior Fit-out Works'
    ],
    featuredProject: {
      title: 'Modern Corporate Office Interior Design at Lalitpur',
      client: 'Private Corporate Client',
      year: '2022',
      image: '/images/about-office.jpg',
      description: 'Premium modern interior fit-out featuring ergonomic workspaces, custom acoustics, and glassmorphic branding screens.'
    }
  },
  {
    id: 'master-plan',
    number: 'Focus Area 03',
    title: 'Master Plan',
    scope: [
      'Urban Planning & Land Use Design',
      'Infrastructure & Utility Network Planning',
      'Route Planning & Circulation Layouts',
      'Socio-Economic & Zonal Development Analysis',
      'Landscape Integration & Green Space Design'
    ],
    featuredProject: {
      title: 'Detailed Master Plan of Sports Complex at Pokhara',
      client: 'Ministry of Youth and Sports, Nepal',
      year: '2019',
      image: '/images/water-resources.jpg',
      description: 'Comprehensive planning and landscape layout of a regional sports stadium complex including hostels, arenas, and green buffers.'
    }
  },
  {
    id: 'hydropower',
    number: 'Focus Area 04',
    title: 'Hydropower',
    scope: [
      'Feasibility & Detailed Engineering Studies (DPR)',
      'Hydrological & Sediment Analysis',
      'Geological & Geotechnical Investigations',
      'Design of Civil Components (Dam, Tunnel, Powerhouse)',
      'Hydro-Mechanical & Electro-Mechanical Design',
      'Transmission Line & Grid Interconnection Planning'
    ],
    featuredProject: {
      title: 'Detailed Engineering Design of Hydropower Scheme (5.5 MW)',
      client: 'Independent Power Producers Association, Nepal',
      year: '2020',
      image: '/images/hydropower-engineering.jpg',
      description: 'DPR preparation including geology review, sediment testing, intake planning, tunnel routing, and powerhouse civil structure design.'
    }
  },
  {
    id: 'water-supply',
    number: 'Focus Area 05',
    title: 'Water Supply',
    scope: [
      'Water Transmission & Distribution Network Analysis',
      'Drinking Water Treatment Plant Design',
      'Ground & Elevated Storage Reservoirs',
      'Rural & Urban Drinking Water Schemes',
      'Wastewater & Sanitation Management Systems'
    ],
    featuredProject: {
      title: 'Detailed Design of Community Water Supply Project at Chitwan',
      client: 'Department of Water Supply and Sewerage (DWSS)',
      year: '2021',
      image: '/images/drinking-water-supply.jpg',
      description: 'Hydraulic modeling of pipeline distribution network, intake structure, sand filtration treatment plant, and a 200 m³ elevated tank.'
    }
  },
  {
    id: 'road-highway',
    number: 'Focus Area 06',
    title: 'Road & Highway',
    scope: [
      'Alignment Survey & Route Optimization',
      'Geometric Design of Highways & Link Roads',
      'Pavement Design (Flexible & Rigid)',
      'Bridges, Culverts & Retaining Structures',
      'Traffic Studies, Surveys & Safety Audits',
      'Bio-Engineering for Slope Stabilization'
    ],
    featuredProject: {
      title: 'Geometric Design and DPR of Rural Link Road',
      client: 'Department of Local Infrastructure (DoLI), Nepal',
      year: '2018',
      image: '/images/highway-engineering.jpg',
      description: 'Topographical route survey, road geometry alignment, drainage structure design, and cost estimations for a 15 km all-weather link road.'
    }
  },
  {
    id: 'surveying',
    number: 'Focus Area 07',
    title: 'Surveying',
    scope: [
      'Topographical & Route Alignment Surveys',
      'Boundary & Cadastral Mapping',
      'Geodetic Surveys using DGPS and Total Station',
      'GIS Database Creation & Asset Mapping',
      'Construction Layout & Engineering Staking'
    ],
    featuredProject: {
      title: 'Topographical Survey & GIS Mapping for Smart City Development',
      client: 'Town Development Fund, Government of Nepal',
      year: '2021',
      image: '/images/survey-engineering.jpg',
      description: 'DGPS horizontal control network establishment, contour survey, and GIS mapping of physical assets over 400 hectares.'
    }
  },
  {
    id: 'valuation',
    number: 'Focus Area 08',
    title: 'Valuation',
    scope: [
      'Land and Building Assets Valuation',
      'Commercial and Industrial Real Estate Assessments',
      'Fair Market Value & Collateral Analyses',
      'Rental Value Appraisals',
      'Corporate Assets Valuations for Bank Financing'
    ],
    featuredProject: {
      title: 'Asset Valuation of Industrial Complex at Birgunj',
      client: 'Nepal Rastra Bank & Commercial Banks',
      year: '2023',
      image: '/images/property-valuation.jpg',
      description: 'Comprehensive physical inventory and fair market valuation of land, factory structures, and utilities for financial appraisal.'
    }
  },
  {
    id: 'environmental-study',
    number: 'Focus Area 09',
    title: 'Environmental Study',
    scope: [
      'Environmental Impact Assessments (EIA)',
      'Initial Environmental Examinations (IEE)',
      'Environmental Management & Monitoring Plans',
      'Climate Vulnerability & Adaptation Studies',
      'Pollution Mitigation Audits'
    ],
    featuredProject: {
      title: 'Initial Environmental Examination (IEE) for Hydropower Project',
      client: 'Ministry of Energy, Water Resources and Irrigation',
      year: '2021',
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
      description: 'Ecological mapping, socio-economic baseline survey, and stakeholder public consultations to prepare mitigation and safety guidelines.'
    }
  },
  {
    id: 'technical-audit',
    number: 'Focus Area 10',
    title: 'Technical Audit',
    scope: [
      'Performance & Quality Assurance Auditing',
      'Design & Specification Compliance Verification',
      'Financial Utilization Reviews',
      'Operational Health & Safety Inspections',
      'Technical Defect Audits'
    ],
    featuredProject: {
      title: 'Technical Audit of Municipal Road Construction Works',
      client: 'National Vigilance Centre (NVC), Lalitpur',
      year: '2022',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80',
      description: 'Materials core testing, layer thickness verification, specification compliance checks, and preparation of audit review reports.'
    }
  },
  {
    id: 'social-safeguards',
    number: 'Focus Area 11',
    title: 'Social Safeguards',
    scope: [
      'Social Impact Assessments (SIA)',
      'Resettlement Action Plans (RAP)',
      'Indigenous Peoples & Vulnerable Groups Development Plans',
      'Livelihood Restoration Planning',
      'Public Consultations & Stakeholder Engagements'
    ],
    featuredProject: {
      title: 'Social Safeguard and Resettlement Action Plan for Transmission Line',
      client: 'Nepal Electricity Authority (NEA)',
      year: '2022',
      image: '/images/social-safeguards.jpg',
      description: 'Household baseline survey, compensation valuation, and grievance redressal coordination for project affected families.'
    }
  }
];

// Fallback Image Component with dynamic caption overlay
function ProjectImagePreview({
  src,
  alt,
  name,
  client,
  year,
}: {
  src: string;
  alt: string;
  name: string;
  client: string;
  year: string;
}) {
  const [imgError, setImgError] = useState(false);
  const fallbackSrc = '/images/projects/project-portfolio-hero.png';

  useEffect(() => {
    setImgError(false);
  }, [src]);

  return (
    <div className="relative overflow-hidden rounded-xl bg-slate-100 border border-slate-200/60 aspect-[4/3] w-full min-h-[220px] flex flex-col justify-end group/img shadow-md">
      <Image
        src={imgError ? fallbackSrc : src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-500 group-hover/img:scale-105"
        onError={() => setImgError(true)}
        sizes="(max-width: 768px) 100vw, 400px"
        priority
      />
      {/* Dynamic text caption / overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent p-4 flex flex-col justify-end text-left pointer-events-none">
        <span className="text-[10px] font-bold text-secondary uppercase tracking-wider mb-1">
          Active Preview
        </span>
        <h4 className="text-white font-bold text-xs md:text-sm leading-snug line-clamp-2">
          {name}
        </h4>
        <div className="text-[11px] text-slate-300 mt-1 line-clamp-1">
          <span className="font-semibold text-white/90">Client:</span> {client}
        </div>
        <div className="text-[11px] text-slate-300 mt-0.5">
          <span className="font-semibold text-white/90">Completed:</span> {year}
        </div>
      </div>
    </div>
  );
}

function FeaturedProjectImagePreview({ src, alt }: { src: string; alt: string }) {
  const [imgError, setImgError] = useState(false);
  const fallbackSrc = '/images/projects/project-portfolio-hero.png';

  useEffect(() => {
    setImgError(false);
  }, [src]);

  return (
    <div className="relative overflow-hidden rounded-xl bg-slate-100 border border-slate-200 aspect-[16/9] w-full max-h-[220px] mb-5 shadow-sm">
      <Image
        src={imgError ? fallbackSrc : src}
        alt={alt}
        fill
        className="object-cover"
        onError={() => setImgError(true)}
        sizes="(max-width: 768px) 100vw, 600px"
      />
    </div>
  );
}

function ClientLogo({ src, alt, initials }: { src: string; alt: string; initials: string }) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [src]);

  return (
    <div className="relative flex h-8 w-8 md:h-9 md:w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-700 shadow-sm overflow-hidden select-none">
      {!imgError ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover p-1"
          onError={() => setImgError(true)}
          sizes="36px"
        />
      ) : (
        <span className="font-heading text-[10px] md:text-xs font-bold text-primary tracking-wider uppercase">
          {initials}
        </span>
      )}
    </div>
  );
}

function ClientItemCard({ sn, name, logo, initials }: { sn: number; name: string; logo: string; initials: string }) {
  return (
    <div className="group flex items-center gap-3.5 rounded-xl border border-slate-150 bg-white p-3 md:p-3.5 shadow-sm transition-all duration-300 hover:border-secondary/40 hover:bg-amber-50/20 text-left">
      <ClientLogo src={logo} alt={name} initials={initials} />
      <div className="flex items-center gap-2 overflow-hidden">
        <span className="font-mono text-xs font-bold text-secondary shrink-0 select-none">
          [{String(sn).padStart(2, '0')}]
        </span>
        <span className="font-heading text-xs md:text-sm font-semibold text-primary group-hover:text-[#0d2137] leading-snug break-words">
          {name}
        </span>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  // Page states
  const [activeClientTab, setActiveClientTab] = useState<'international' | 'national'>('international');
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>('building-design');
  const [selectedProject, setSelectedProject] = useState<CompletedProject>(buildingDesignProjects[0]);

  // Dynamically change default selected project when switching tabs
  useEffect(() => {
    if (activeCategoryTab === 'building-design') {
      setSelectedProject(buildingDesignProjects[0]);
    } else if (activeCategoryTab === 'interior-design') {
      setSelectedProject(interiorDesignProjects[0]);
    } else if (activeCategoryTab === 'master-plan') {
      setSelectedProject(masterPlanProjects[0]);
    } else if (activeCategoryTab === 'hydropower') {
      setSelectedProject(hydropowerProjects[0]);
    } else if (activeCategoryTab === 'technical-audit') {
      setSelectedProject(technicalAuditProjects[0]);
    } else if (activeCategoryTab === 'valuation') {
      setSelectedProject(valuationProjects[0]);
    }
  }, [activeCategoryTab]);

  const activeFocusArea = focusAreas.find(fa => fa.id === activeCategoryTab) || focusAreas[0];

  return (
    <div className="min-h-screen bg-slate-50 pt-40 md:pt-48 pb-24">
      {/* Back Link Container */}
      <div className="container-pace mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-secondary transition-colors duration-200"
        >
          <HiArrowLeft className="h-5 w-5" />
          Back to Home
        </Link>
      </div>

      {/* Page Hero - Mountain Background */}
      <div className="container-pace mb-12">
        <div className="relative overflow-hidden rounded-2xl min-h-[12rem] sm:min-h-[13rem] md:min-h-[14rem]">
          <Image
            src="/images/mount-everest.png"
            alt="Snow-capped mountains in Nepal"
            fill
            className="object-cover object-center"
            sizes="(max-width: 1280px) 100vw, 1280px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/25 via-slate-900/10 to-slate-900/25 pointer-events-none" />

          <div className="relative z-10 flex items-center px-4 py-5 sm:px-6 md:px-8 md:py-6">
            <div className="w-full max-w-4xl mx-auto">
              <div className="relative overflow-hidden rounded-xl bg-white/95 border border-white/80 shadow-lg px-5 py-4 sm:px-8 sm:py-5">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#b8860b] via-[#E8A020] to-[#9b7023] rounded-l-xl" />
                <div className="absolute top-0 right-0 pointer-events-none overflow-hidden w-32 h-32 rounded-tr-xl">
                  <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#E8A020]/10" />
                  <div className="absolute top-6 right-6 w-20 h-20 rounded-full bg-[#E8A020]/15" />
                </div>
                <div className="relative z-10 flex flex-col items-start text-left">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="h-2 w-2 rounded-full bg-secondary shadow-sm" />
                    <span className="font-heading text-xs font-bold uppercase tracking-[0.15em] text-secondary">
                      Our Projects
                    </span>
                  </div>
                  <h1 className="font-heading text-xl sm:text-2xl md:text-[1.75rem] font-bold text-primary leading-snug mb-3 text-balance">
                    National and international engineering and design projects
                  </h1>
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-2xl">
                    View completed work in residential, commercial, infrastructure, and government sectors.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: PROJECT CATEGORIES (Tabs & Detail Content) */}
      <div className="container-pace mb-20">
        {/* Section Header */}
        <div className="flex flex-col items-center justify-center text-center mb-8 gap-3 border-b border-slate-200 pb-5">
          <div className="flex justify-center items-center">
            <span className="rounded-full bg-secondary/15 border border-secondary/35 text-secondary px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider">
              11 Focus Areas
            </span>
          </div>
          <h2 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-emerald-600">
            Project Categories
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
            Click a project category to view its complete project scope.
          </p>
        </div>

        {/* Categories Tabs Scrollable Area */}
        <div className="flex overflow-x-auto pb-4 mb-8 -mx-4 px-4 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
          <div className="flex gap-2">
            {focusAreas.map((fa) => (
              <button
                key={fa.id}
                onClick={() => setActiveCategoryTab(fa.id)}
                className={`rounded-full px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-300 shrink-0 border ${
                  activeCategoryTab === fa.id
                    ? 'bg-secondary border-secondary text-white shadow-md scale-102'
                    : 'bg-white border-slate-200 text-primary hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                {fa.title}
              </button>
            ))}
          </div>
        </div>

        {/* Large Content Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-card overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 md:p-8">
            
            {/* LEFT COLUMN: Service Scope Details */}
            <div className="lg:col-span-5 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-100 pb-8 lg:pb-0 lg:pr-8 text-left">
              <div>
                <span className="inline-block text-[11px] font-bold text-secondary bg-amber-50 border border-secondary/30 rounded px-2.5 py-0.5 uppercase tracking-wide mb-3">
                  {activeFocusArea.number}
                </span>
                <h3 className="font-heading text-2xl font-bold text-primary mb-5">
                  {activeFocusArea.title}
                </h3>
                
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                  Complete Scope of Consulting Services
                </h4>
                
                <ul className="space-y-3.5">
                  {activeFocusArea.scope.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary mt-0.5">
                        <HiCheck className="h-3 w-3" />
                      </span>
                      <span className="leading-normal">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* RIGHT COLUMN: Interactive Projects List / Previews */}
            <div className="lg:col-span-7 flex flex-col justify-start text-left">
              {activeCategoryTab === 'building-design' ? (
                /* BUILDING DESIGN COMPLETE PORTFOLIO */
                <div className="flex flex-col h-full justify-between">
                  <h4 className="font-heading text-base font-bold text-primary border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
                    <span>Completed Projects</span>
                    <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2.5 py-0.5 rounded-full border border-slate-100">
                      {buildingDesignProjects.length} Projects Listed
                    </span>
                  </h4>

                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                    
                    {/* Projects Table / Scrollable list */}
                    <div className="xl:col-span-7 w-full">
                      <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden shadow-inner pr-1">
                        {buildingDesignProjects.map((proj, idx) => {
                          const isActive = selectedProject.sn === proj.sn;
                          return (
                            <div key={proj.sn}>
                              {idx === 0 && (
                                <div className="p-3.5 bg-slate-50 border-b border-slate-100 text-left">
                                  <h5 className="font-heading text-xs font-bold text-secondary uppercase tracking-wider">
                                    Major Building Design Assignments
                                  </h5>
                                </div>
                              )}
                              {idx === 6 && (
                                <div className="p-3.5 bg-slate-50 border-b border-slate-100 border-t border-slate-100 text-left">
                                  <h5 className="font-heading text-xs font-bold text-secondary uppercase tracking-wider">
                                    Completed Projects
                                  </h5>
                                </div>
                              )}
                              <button
                                onClick={() => setSelectedProject(proj)}
                                className={`w-full text-left p-3.5 transition-all duration-200 block border-l-4 ${
                                  isActive
                                    ? 'bg-amber-50/50 border-secondary'
                                    : 'bg-white border-transparent hover:bg-slate-50/50'
                                }`}
                              >
                                <div className="flex items-start gap-2.5">
                                  <span className={`text-xs font-mono font-bold mt-0.5 shrink-0 ${
                                    isActive ? 'text-secondary' : 'text-slate-400'
                                  }`}>
                                    [{String(proj.sn).padStart(2, '0')}]
                                  </span>
                                  <div className="flex-1">
                                    <h5 className={`text-xs sm:text-sm font-semibold leading-snug transition-colors duration-200 ${
                                      isActive ? 'text-[#0d2137] font-bold' : 'text-primary hover:text-secondary'
                                    }`}>
                                      {proj.name}
                                    </h5>
                                    <div className="text-[11px] text-slate-500 mt-1">
                                      <span className="font-medium text-slate-400">Client:</span> {proj.client}
                                    </div>
                                    
                                    {proj.bullets && (
                                      <ul className="list-disc pl-4 space-y-1 mt-2 text-[11px] text-slate-650">
                                        {proj.bullets.map((bullet, bIdx) => (
                                          <li key={bIdx}>{bullet}</li>
                                        ))}
                                      </ul>
                                    )}

                                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100/50">
                                      <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                                        <HiCalendar className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                                        {proj.year}
                                      </span>
                                      <span className="text-[9px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded border border-emerald-100/80">
                                        {proj.remarks}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Image Preview Box */}
                    <div className="xl:col-span-5 w-full">
                      <ProjectImagePreview
                        src={selectedProject.image}
                        alt={selectedProject.name}
                        name={selectedProject.name}
                        client={selectedProject.client}
                        year={selectedProject.year}
                      />
                    </div>

                  </div>
                </div>
              ) : activeCategoryTab === 'interior-design' ? (
                /* INTERIOR DESIGN COMPLETE PORTFOLIO */
                <div className="flex flex-col h-full justify-between">
                  <h4 className="font-heading text-base font-bold text-primary border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
                    <span>Completed Projects</span>
                    <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2.5 py-0.5 rounded-full border border-slate-100">
                      {interiorDesignProjects.length} Projects Listed
                    </span>
                  </h4>

                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                    
                    {/* Projects Table / Scrollable list */}
                    <div className="xl:col-span-7 w-full">
                      <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden shadow-inner pr-1">
                        {interiorDesignProjects.map((proj) => {
                          const isActive = selectedProject.sn === proj.sn;
                          return (
                            <button
                              key={proj.sn}
                              onClick={() => setSelectedProject(proj)}
                              className={`w-full text-left p-3.5 transition-all duration-200 block border-l-4 ${
                                isActive
                                  ? 'bg-amber-50/50 border-secondary'
                                  : 'bg-white border-transparent hover:bg-slate-50/50'
                              }`}
                            >
                              <div className="flex items-start gap-2.5">
                                <span className={`text-xs font-mono font-bold mt-0.5 shrink-0 ${
                                  isActive ? 'text-secondary' : 'text-slate-400'
                                }`}>
                                  [{String(proj.sn).padStart(2, '0')}]
                                </span>
                                <div className="flex-1">
                                  <h5 className={`text-xs sm:text-sm font-semibold leading-snug transition-colors duration-200 ${
                                    isActive ? 'text-[#0d2137] font-bold' : 'text-primary hover:text-secondary'
                                  }`}>
                                    {proj.name}
                                  </h5>
                                  <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                                    <span className="font-medium text-slate-400">Client:</span> {proj.client}
                                  </div>
                                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100/50">
                                    <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                                      <HiCalendar className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                                      {proj.year}
                                    </span>
                                    <span className="text-[9px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded border border-emerald-100/80">
                                      {proj.remarks}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Image Preview Box */}
                    <div className="xl:col-span-5 w-full">
                      <ProjectImagePreview
                        src={selectedProject.image}
                        alt={selectedProject.name}
                        name={selectedProject.name}
                        client={selectedProject.client}
                        year={selectedProject.year}
                      />
                    </div>

                  </div>
                </div>
              ) : activeCategoryTab === 'master-plan' ? (
                /* MASTER PLAN COMPLETE PORTFOLIO */
                <div className="flex flex-col h-full justify-between">
                  <h4 className="font-heading text-base font-bold text-primary border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
                    <span>Completed Projects</span>
                    <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2.5 py-0.5 rounded-full border border-slate-100">
                      {masterPlanProjects.length} Projects Listed
                    </span>
                  </h4>

                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                    
                    {/* Projects Table / Scrollable list */}
                    <div className="xl:col-span-7 w-full">
                      <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden shadow-inner pr-1">
                        {masterPlanProjects.map((proj) => {
                          const isActive = selectedProject.sn === proj.sn;
                          return (
                            <button
                              key={proj.sn}
                              onClick={() => setSelectedProject(proj)}
                              className={`w-full text-left p-3.5 transition-all duration-200 block border-l-4 ${
                                isActive
                                  ? 'bg-amber-50/50 border-secondary'
                                  : 'bg-white border-transparent hover:bg-slate-50/50'
                              }`}
                            >
                              <div className="flex items-start gap-2.5">
                                <span className={`text-xs font-mono font-bold mt-0.5 shrink-0 ${
                                  isActive ? 'text-secondary' : 'text-slate-400'
                                }}`}>
                                  [{String(proj.sn).padStart(2, '0')}]
                                </span>
                                <div className="flex-1">
                                  <h5 className={`text-xs sm:text-sm font-semibold leading-snug transition-colors duration-200 ${
                                    isActive ? 'text-[#0d2137] font-bold' : 'text-primary hover:text-secondary'
                                  }`}>
                                    {proj.name}
                                  </h5>
                                  <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                                    <span className="font-medium text-slate-400">Client:</span> {proj.client}
                                  </div>
                                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100/50">
                                    <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                                      <HiCalendar className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                                      {proj.year}
                                    </span>
                                    <span className="text-[9px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded border border-emerald-100/80">
                                      {proj.remarks}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Image Preview Box */}
                    <div className="xl:col-span-5 w-full">
                      <ProjectImagePreview
                        src={selectedProject.image}
                        alt={selectedProject.name}
                        name={selectedProject.name}
                        client={selectedProject.client}
                        year={selectedProject.year}
                      />
                    </div>

                  </div>
                </div>
              ) : activeCategoryTab === 'hydropower' ? (
                /* HYDROPOWER COMPLETE PORTFOLIO */
                <div className="flex flex-col h-full justify-between">
                  <h4 className="font-heading text-base font-bold text-primary border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
                    <span>Completed Projects</span>
                    <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2.5 py-0.5 rounded-full border border-slate-100">
                      {hydropowerProjects.length} Projects Listed
                    </span>
                  </h4>

                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                    
                    {/* Projects Table / Scrollable list */}
                    <div className="xl:col-span-7 w-full">
                      <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden shadow-inner pr-1">
                        {hydropowerProjects.map((proj) => {
                          const isActive = selectedProject.sn === proj.sn;
                          return (
                            <button
                              key={proj.sn}
                              onClick={() => setSelectedProject(proj)}
                              className={`w-full text-left p-3.5 transition-all duration-200 block border-l-4 ${
                                isActive
                                  ? 'bg-amber-50/50 border-secondary'
                                  : 'bg-white border-transparent hover:bg-slate-50/50'
                              }`}
                            >
                              <div className="flex items-start gap-2.5">
                                <span className={`text-xs font-mono font-bold mt-0.5 shrink-0 ${
                                  isActive ? 'text-secondary' : 'text-slate-400'
                                }}`}>
                                  [{String(proj.sn).padStart(2, '0')}]
                                </span>
                                <div className="flex-1">
                                  <h5 className={`text-xs sm:text-sm font-semibold leading-snug transition-colors duration-200 ${
                                    isActive ? 'text-[#0d2137] font-bold' : 'text-primary hover:text-secondary'
                                  }`}>
                                    {proj.name}
                                  </h5>
                                  <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                                    <span className="font-medium text-slate-400">Client:</span> {proj.client}
                                  </div>
                                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100/50">
                                    <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                                      <HiCalendar className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                                      {proj.year}
                                    </span>
                                    <span className="text-[9px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded border border-emerald-100/80">
                                      {proj.remarks}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Image Preview Box */}
                    <div className="xl:col-span-5 w-full">
                      <ProjectImagePreview
                        src={selectedProject.image}
                        alt={selectedProject.name}
                        name={selectedProject.name}
                        client={selectedProject.client}
                        year={selectedProject.year}
                      />
                    </div>

                  </div>
                </div>
              ) : activeCategoryTab === 'technical-audit' ? (
                /* TECHNICAL AUDIT COMPLETE PORTFOLIO */
                <div className="flex flex-col h-full justify-between">
                  <h4 className="font-heading text-base font-bold text-primary border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
                    <span>Completed Projects</span>
                    <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2.5 py-0.5 rounded-full border border-slate-100">
                      {technicalAuditProjects.length} Projects Listed
                    </span>
                  </h4>

                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                    
                    {/* Projects Table / Scrollable list */}
                    <div className="xl:col-span-7 w-full">
                      <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden shadow-inner pr-1">
                        {technicalAuditProjects.map((proj) => {
                          const isActive = selectedProject.sn === proj.sn;
                          return (
                            <button
                              key={proj.sn}
                              onClick={() => setSelectedProject(proj)}
                              className={`w-full text-left p-3.5 transition-all duration-200 block border-l-4 ${
                                isActive
                                  ? 'bg-amber-50/50 border-secondary'
                                  : 'bg-white border-transparent hover:bg-slate-50/50'
                              }`}
                            >
                              <div className="flex items-start gap-2.5">
                                <span className={`text-xs font-mono font-bold mt-0.5 shrink-0 ${
                                  isActive ? 'text-secondary' : 'text-slate-400'
                                }`}>
                                  [{String(proj.sn).padStart(2, '0')}]
                                </span>
                                <div className="flex-1">
                                  <h5 className={`text-xs sm:text-sm font-semibold leading-snug transition-colors duration-200 ${
                                    isActive ? 'text-[#0d2137] font-bold' : 'text-primary hover:text-secondary'
                                  }`}>
                                    {proj.name}
                                  </h5>
                                  <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                                    <span className="font-medium text-slate-400">Client:</span> {proj.client}
                                  </div>
                                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100/50">
                                    <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                                      <HiCalendar className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                                      {proj.year}
                                    </span>
                                    <span className="text-[9px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded border border-emerald-100/80">
                                      {proj.remarks}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Image Preview Box */}
                    <div className="xl:col-span-5 w-full">
                      <ProjectImagePreview
                        src={selectedProject.image}
                        alt={selectedProject.name}
                        name={selectedProject.name}
                        client={selectedProject.client}
                        year={selectedProject.year}
                      />
                    </div>

                  </div>
                </div>
              ) : activeCategoryTab === 'valuation' ? (
                /* VALUATION COMPLETE PORTFOLIO */
                <div className="flex flex-col h-full justify-between">
                  <h4 className="font-heading text-base font-bold text-primary border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
                    <span>Completed Projects</span>
                    <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2.5 py-0.5 rounded-full border border-slate-100">
                      {valuationProjects.length} Projects Listed
                    </span>
                  </h4>

                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                    
                    {/* Projects Table / Scrollable list */}
                    <div className="xl:col-span-7 w-full">
                      <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden shadow-inner pr-1">
                        {valuationProjects.map((proj) => {
                          const isActive = selectedProject.sn === proj.sn;
                          return (
                            <button
                              key={proj.sn}
                              onClick={() => setSelectedProject(proj)}
                              className={`w-full text-left p-3.5 transition-all duration-200 block border-l-4 ${
                                isActive
                                  ? 'bg-amber-50/50 border-secondary'
                                  : 'bg-white border-transparent hover:bg-slate-50/50'
                              }`}
                            >
                              <div className="flex items-start gap-2.5">
                                <span className={`text-xs font-mono font-bold mt-0.5 shrink-0 ${
                                  isActive ? 'text-secondary' : 'text-slate-400'
                                }`}>
                                  [{String(proj.sn).padStart(2, '0')}]
                                </span>
                                <div className="flex-1">
                                  <h5 className={`text-xs sm:text-sm font-semibold leading-snug transition-colors duration-200 ${
                                    isActive ? 'text-[#0d2137] font-bold' : 'text-primary hover:text-secondary'
                                  }`}>
                                    {proj.name}
                                  </h5>
                                  <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                                    <span className="font-medium text-slate-400">Client:</span> {proj.client}
                                  </div>
                                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100/50">
                                    <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                                      <HiCalendar className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                                      {proj.year}
                                    </span>
                                    <span className="text-[9px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded border border-emerald-100/80">
                                      {proj.remarks}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Image Preview Box */}
                    <div className="xl:col-span-5 w-full">
                      <ProjectImagePreview
                        src={selectedProject.image}
                        alt={selectedProject.name}
                        name={selectedProject.name}
                        client={selectedProject.client}
                        year={selectedProject.year}
                      />
                    </div>

                  </div>
                </div>
              ) : (
                /* OTHER FOCUS AREAS FEATURED PROJECT PREVIEW */
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <h4 className="font-heading text-base font-bold text-primary border-b border-slate-100 pb-3 mb-4">
                      Featured Project
                    </h4>
                    
                    <FeaturedProjectImagePreview
                      src={activeFocusArea.featuredProject.image}
                      alt={activeFocusArea.featuredProject.title}
                    />

                    <h5 className="font-heading text-md sm:text-lg font-bold text-primary mb-2">
                      {activeFocusArea.featuredProject.title}
                    </h5>

                    <p className="text-sm text-slate-600 leading-relaxed mb-4">
                      {activeFocusArea.featuredProject.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 mt-auto">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Client</span>
                      <span className="text-xs font-semibold text-primary block mt-0.5 leading-tight">
                        {activeFocusArea.featuredProject.client}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Completion Year</span>
                      <span className="text-xs font-semibold text-primary block mt-0.5 leading-tight">
                        {activeFocusArea.featuredProject.year}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* SECTION 2: CLIENTS SECTION */}
      <div className="container-pace border-t border-slate-200 pt-16">
        {/* Section Header */}
        <div className="text-left mb-8">
          <span className="text-secondary text-sm font-bold uppercase tracking-wider block mb-2">
            Our Trusted Partners
          </span>
          <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-primary">
            Our Clients
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            We are proud to have collaborated with leading international agencies, national departments, and private entities nationally and internationally.
          </p>
        </div>

        {/* Clients Category Filters */}
        <div className="flex flex-wrap gap-3 mb-8 border-b border-gray-200 pb-6">
          <button
            onClick={() => setActiveClientTab('international')}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 ${
              activeClientTab === 'international'
                ? 'bg-secondary text-white shadow-md scale-102'
                : 'bg-white text-primary border border-slate-200 hover:bg-slate-50'
            }`}
          >
            International Clients ({internationalClients.length})
          </button>
          <button
            onClick={() => setActiveClientTab('national')}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 ${
              activeClientTab === 'national'
                ? 'bg-secondary text-white shadow-md scale-102'
                : 'bg-white text-primary border border-slate-200 hover:bg-slate-50'
            }`}
          >
            National Clients ({nationalClients.length})
          </button>
        </div>

        {/* Clients Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {activeClientTab === 'international' ? (
            internationalClients.map((client) => (
              <ClientItemCard
                key={client.sn}
                sn={client.sn}
                name={client.name}
                logo={client.logo}
                initials={client.initials}
              />
            ))
          ) : (
            nationalClients.map((client) => (
              <ClientItemCard
                key={client.sn}
                sn={client.sn}
                name={client.name}
                logo={client.logo}
                initials={client.initials}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
