export interface StateData {
  name: string;
  isUnionTerritory: boolean;
  districts: string[];
}

export interface CityHub {
  city: string;
  state: string;
  district: string;
  localities: {
    name: string;
    pincode: string;
    hasDelivery: boolean;
  }[];
}

export const INDIA_STATES_AND_UTS: StateData[] = [
  // 28 States
  {
    name: "Andhra Pradesh",
    isUnionTerritory: false,
    districts: ["Alluri Sitharama Raju", "Anakapalli", "Ananthapuramu", "Annamayya", "Bapatla", "Chittoor", "Dr. B.R. Ambedkar Konaseema", "East Godavari", "Eluru", "Guntur", "Kakinada", "Krishna", "Kurnool", "Nandyal", "NTR", "Palnadu", "Parvathipuram Manyam", "Prakasam", "Sri Potti Sriramulu Nellore", "Sri Sathya Sai", "Srikakulam", "Tirupati", "Visakhapatnam", "Vizianagaram", "West Godavari", "YSR"]
  },
  {
    name: "Arunachal Pradesh",
    isUnionTerritory: false,
    districts: ["Anjaw", "Changlang", "Dibang Valley", "East Kameng", "East Siang", "Kamle", "Kra Daadi", "Kurung Kumey", "Lepa Rada", "Lohit", "Longding", "Lower Dibang Valley", "Lower Siang", "Lower Subansiri", "Namsai", "Pakke Kessang", "Papum Pare", "Shi Yomi", "Siang", "Tawang", "Tirap", "Upper Siang", "Upper Subansiri", "West Kameng", "West Siang"]
  },
  {
    name: "Assam",
    isUnionTerritory: false,
    districts: ["Baksa", "Barpeta", "Biswanath", "Bongaigaon", "Cachar", "Charaideo", "Chirang", "Darrang", "Dhemaji", "Dhubri", "Dibrugarh", "Dima Hasao", "Goalpara", "Golaghat", "Hailakandi", "Hojai", "Jorhat", "Kamrup", "Kamrup Metropolitan", "Karbi Anglong", "Karimganj", "Kokrajhar", "Lakhimpur", "Majuli", "Morigaon", "Nagaon", "Nalbari", "Sivasagar", "Sonitpur", "South Salmara-Mankachar", "Tinsukia", "Udalguri", "West Karbi Anglong"]
  },
  {
    name: "Bihar",
    isUnionTerritory: false,
    districts: ["Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur", "Buxar", "Darbhanga", "East Champaran", "Gaya", "Gopalganj", "Jamui", "Jehanabad", "Kaimur", "Katihar", "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura", "Madhubani", "Munger", "Muzaffarpur", "Nalanda", "Nawada", "Patna", "Purnia", "Rohtas", "Saharsa", "Samastipur", "Saran", "Sheikhpura", "Sheohar", "Sitamarhi", "Siwan", "Supaul", "Vaishali", "West Champaran"]
  },
  {
    name: "Chhattisgarh",
    isUnionTerritory: false,
    districts: ["Balod", "Baloda Bazar", "Balrampur", "Bastar", "Bemetara", "Bijapur", "Bilaspur", "Dantewada", "Dhamtari", "Durg", "Gariaband", "Gaurela Pendra Marwahi", "Janjgir Champa", "Jashpur", "Kabirdham", "Kanker", "Kondagaon", "Korba", "Koriya", "Mahasamund", "Manendragarh-Chirmiri-Bharatpur", "Mohla-Manpur-Ambagarh Chowki", "Mungeli", "Narayanpur", "Raigarh", "Raipur", "Rajnandgaon", "Sarangarh-Bilaigarh", "Sakti", "Sukma", "Surajpur", "Surguja"]
  },
  {
    name: "Goa",
    isUnionTerritory: false,
    districts: ["North Goa", "South Goa"]
  },
  {
    name: "Gujarat",
    isUnionTerritory: false,
    districts: ["Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", "Bhavnagar", "Botad", "Chhota Udaipur", "Dahod", "Dang", "Devbhoomi Dwarka", "Gandhinagar", "Gir Somnath", "Jamnagar", "Junagadh", "Kheda", "Kutch", "Mahisagar", "Mehsana", "Morbi", "Narmada", "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat", "Surendranagar", "Tapi", "Vadodara", "Valsad"]
  },
  {
    name: "Haryana",
    isUnionTerritory: false,
    districts: ["Ambala", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad", "Gurugram", "Hisar", "Jhajjar", "Jind", "Kaithal", "Karnal", "Kurukshetra", "Mahendragarh", "Nuh", "Palwal", "Panchkula", "Panipat", "Rewari", "Rohtak", "Sirsa", "Sonipat", "Yamunanagar"]
  },
  {
    name: "Himachal Pradesh",
    isUnionTerritory: false,
    districts: ["Bilaspur", "Chamba", "Hamirpur", "Kangra", "Kinnaur", "Kullu", "Lahaul and Spiti", "Mandi", "Shimla", "Sirmaur", "Solan", "Una"]
  },
  {
    name: "Jharkhand",
    isUnionTerritory: false,
    districts: ["Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka", "East Singhbhum", "Garhwa", "Giridih", "Godda", "Gumla", "Hazaribagh", "Jamtara", "Khunti", "Koderma", "Latehar", "Lohardaga", "Pakur", "Palamu", "Ramgarh", "Ranchi", "Sahebganj", "Seraikela Kharsawan", "Simdega", "West Singhbhum"]
  },
  {
    name: "Karnataka",
    isUnionTerritory: false,
    districts: ["Bagalkote", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban", "Bidar", "Chamarajanagar", "Chikkaballapura", "Chikkamagaluru", "Chitradurga", "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Hassan", "Haveri", "Kalaburagi", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru", "Raichur", "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada", "Vijayanagara", "Vijayapura", "Yadgir"]
  },
  {
    name: "Kerala",
    isUnionTerritory: false,
    districts: ["Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad"]
  },
  {
    name: "Madhya Pradesh",
    isUnionTerritory: false,
    districts: ["Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat", "Barwani", "Betul", "Bhind", "Bhopal", "Burhanpur", "Chhatarpur", "Chhindwara", "Damoh", "Datia", "Dewas", "Dhar", "Dindori", "Guna", "Gwalior", "Harda", "Hoshangabad", "Indore", "Jabalpur", "Jhabua", "Katni", "Khandwa", "Khargone", "Mandla", "Mandsaur", "Morena", "Narsinghpur", "Neemuch", "Niwari", "Panna", "Raisen", "Rajgarh", "Ratlam", "Rewa", "Sagar", "Satna", "Sehore", "Seoni", "Shahdol", "Shajapur", "Sheopur", "Shivpuri", "Sidhi", "Singrauli", "Tikamgarh", "Ujjain", "Umaria", "Vidisha"]
  },
  {
    name: "Maharashtra",
    isUnionTerritory: false,
    districts: ["Ahmednagar", "Akola", "Amravati", "Chhatrapati Sambhajinagar", "Beed", "Bhandara", "Buldhana", "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar", "Nashik", "Dharashiv", "Palghar", "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"]
  },
  {
    name: "Manipur",
    isUnionTerritory: false,
    districts: ["Bishnupur", "Chandel", "Churachandpur", "Imphal East", "Imphal West", "Jiribam", "Kakching", "Kamjong", "Kangpokpi", "Noney", "Pherzawl", "Senapati", "Tamenglong", "Tengnoupal", "Thoubal", "Ukhrul"]
  },
  {
    name: "Meghalaya",
    isUnionTerritory: false,
    districts: ["Eastern West Khasi Hills", "East Garo Hills", "East Jaintia Hills", "East Khasi Hills", "North Garo Hills", "Ri Bhoi", "South Garo Hills", "South West Garo Hills", "South West Khasi Hills", "West Garo Hills", "West Jaintia Hills", "West Khasi Hills"]
  },
  {
    name: "Mizoram",
    isUnionTerritory: false,
    districts: ["Aizawl", "Champhai", "Hnahthial", "Khawzawl", "Kolasib", "Lawngtlai", "Lunglei", "Mamit", "Saitual", "Serchhip", "Siaha"]
  },
  {
    name: "Nagaland",
    isUnionTerritory: false,
    districts: ["Chümoukedima", "Dimapur", "Kiphire", "Kohima", "Longleng", "Mokokchung", "Mon", "Niuland", "Noklak", "Peren", "Phek", "Shamator", "Tseminyü", "Tuensang", "Wokha", "Zünheboto"]
  },
  {
    name: "Odisha",
    isUnionTerritory: false,
    districts: ["Angul", "Balangir", "Balasore", "Bargarh", "Bhadrak", "Boudh", "Cuttack", "Deogarh", "Dhenkanal", "Gajapati", "Ganjam", "Jagatsinghapur", "Jajpur", "Jharsuguda", "Kalahandi", "Kandhamal", "Kendrapara", "Kendujhar", "Khordha", "Koraput", "Malkangiri", "Mayurbhanj", "Nabarangpur", "Nayagarh", "Nuapada", "Puri", "Rayagada", "Sambalpur", "Subarnapur", "Sundargarh"]
  },
  {
    name: "Punjab",
    isUnionTerritory: false,
    districts: ["Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib", "Fazilka", "Ferozepur", "Gurdaspur", "Hoshiarpur", "Jalandhar", "Kapurthala", "Ludhiana", "Malerkotla", "Mansa", "Moga", "Muktsar", "Pathankot", "Patiala", "Rupnagar", "Sahibzada Ajit Singh Nagar", "Sangrur", "Shahid Bhagat Singh Nagar", "Tarn Taran"]
  },
  {
    name: "Rajasthan",
    isUnionTerritory: false,
    districts: ["Ajmer", "Alwar", "Banswara", "Baran", "Barmer", "Bharatpur", "Bhilwara", "Bikaner", "Bundi", "Chittorgarh", "Churu", "Dausa", "Dholpur", "Dungarpur", "Hanumangarh", "Jaipur", "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu", "Jodhpur", "Karauli", "Kota", "Nagaur", "Pali", "Pratapgarh", "Rajsamand", "Sawai Madhopur", "Sikar", "Sirohi", "Sri Ganganagar", "Tonk", "Udaipur"]
  },
  {
    name: "Sikkim",
    isUnionTerritory: false,
    districts: ["Gangtok", "Gyalshing", "Mangan", "Namchi", "Pakyong", "Soreng"]
  },
  {
    name: "Tamil Nadu",
    isUnionTerritory: false,
    districts: ["Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"]
  },
  {
    name: "Telangana",
    isUnionTerritory: false,
    districts: ["Adilabad", "Bhadradri Kothagudem", "Hanamkonda", "Hyderabad", "Jagtial", "Jangaon", "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar", "Khammam", "Kumuram Bheem", "Mahabubabad", "Mahabubnagar", "Mancherial", "Medak", "Medchal Malkajgiri", "Mulugu", "Nagarkurnool", "Nalgonda", "Narayanpet", "Nirmal", "Nizamabad", "Peddapalli", "Rajanna Sircilla", "Rangareddy", "Sangareddy", "Siddipet", "Suryapet", "Vikarabad", "Wanaparthy", "Warangal", "Yadadri Bhuvanagiri"]
  },
  {
    name: "Tripura",
    isUnionTerritory: false,
    districts: ["Dhalai", "Gomati", "Khowai", "North Tripura", "Sepahijala", "South Tripura", "Unakoti", "West Tripura"]
  },
  {
    name: "Uttar Pradesh",
    isUnionTerritory: false,
    districts: ["Agra", "Aligarh", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Ayodhya", "Azamgarh", "Baghpat", "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly", "Basti", "Bhadohi", "Bijnor", "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi", "Kheri", "Kushinagar", "Lalitpur", "Lucknow", "Maharajganj", "Mahoba", "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh", "Prayagraj", "Raebareli", "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar", "Shahjahanpur", "Shamli", "Shravasti", "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"]
  },
  {
    name: "Uttarakhand",
    isUnionTerritory: false,
    districts: ["Almora", "Bageshwar", "Chamoli", "Champawat", "Dehradun", "Haridwar", "Nainital", "Pauri Garhwal", "Pithoragarh", "Rudraprayag", "Tehri Garhwal", "Udham Singh Nagar", "Uttarkashi"]
  },
  {
    name: "West Bengal",
    isUnionTerritory: false,
    districts: ["Alipurduar", "Bankura", "Birbhum", "Cooch Behar", "Dakshin Dinajpur", "Darjeeling", "Hooghly", "Howrah", "Jalpaiguri", "Jhargram", "Kalimpong", "Kolkata", "Malda", "Murshidabad", "Nadia", "North 24 Parganas", "Paschim Bardhaman", "Paschim Medinipur", "Purba Bardhaman", "Purba Medinipur", "Purulia", "South 24 Parganas", "Uttar Dinajpur"]
  },

  // 8 Union Territories
  {
    name: "Andaman and Nicobar Islands",
    isUnionTerritory: true,
    districts: ["Nicobar", "North and Middle Andaman", "South Andaman"]
  },
  {
    name: "Chandigarh",
    isUnionTerritory: true,
    districts: ["Chandigarh"]
  },
  {
    name: "Dadra and Nagar Haveli and Daman and Diu",
    isUnionTerritory: true,
    districts: ["Dadra and Nagar Haveli", "Daman", "Diu"]
  },
  {
    name: "Delhi",
    isUnionTerritory: true,
    districts: ["Central Delhi", "East Delhi", "New Delhi", "North Delhi", "North East Delhi", "North West Delhi", "Shahdara", "South Delhi", "South East Delhi", "South West Delhi", "West Delhi"]
  },
  {
    name: "Jammu and Kashmir",
    isUnionTerritory: true,
    districts: ["Anantnag", "Bandipora", "Baramulla", "Budgam", "Doda", "Ganderbal", "Jammu", "Kathua", "Kishtwar", "Kulgam", "Kupwara", "Poonch", "Pulwama", "Rajouri", "Ramban", "Reasi", "Samba", "Shopian", "Srinagar", "Udhampur"]
  },
  {
    name: "Ladakh",
    isUnionTerritory: true,
    districts: ["Kargil", "Leh"]
  },
  {
    name: "Lakshadweep",
    isUnionTerritory: true,
    districts: ["Lakshadweep"]
  },
  {
    name: "Puducherry",
    isUnionTerritory: true,
    districts: ["Karaikal", "Mahe", "Puducherry", "Yanam"]
  }
];

// Delivery Hubs & verified localities
export const CRAVE_DELIVERY_HUBS: CityHub[] = [
  {
    city: "Mumbai",
    state: "Maharashtra",
    district: "Mumbai Suburban",
    localities: [
      { name: "Bandra West (Pali Hill & Carter Rd)", pincode: "400050", hasDelivery: true },
      { name: "Juhu & Vile Parle", pincode: "400049", hasDelivery: true },
      { name: "Powai & Hiranandani", pincode: "400076", hasDelivery: true },
      { name: "Lower Parel & Worli", pincode: "400013", hasDelivery: true },
      { name: "Andheri West (Lokhandwala)", pincode: "400053", hasDelivery: true },
      { name: "Colaba & Nariman Point", pincode: "400005", hasDelivery: true },
      { name: "Borivali West", pincode: "400092", hasDelivery: true },
      { name: "Thane West (Meadows)", pincode: "400610", hasDelivery: false }
    ]
  },
  {
    city: "Bengaluru",
    state: "Karnataka",
    district: "Bengaluru Urban",
    localities: [
      { name: "Indiranagar 100ft Road", pincode: "560038", hasDelivery: true },
      { name: "Koramangala 4th Block", pincode: "560034", hasDelivery: true },
      { name: "HSR Layout Sector 3", pincode: "560102", hasDelivery: true },
      { name: "Lavelle Road & Church St", pincode: "560001", hasDelivery: true },
      { name: "Whitefield (ITPL & ECC)", pincode: "560066", hasDelivery: true },
      { name: "JP Nagar 2nd Phase", pincode: "560078", hasDelivery: true },
      { name: "Hebbal Kempapura", pincode: "560024", hasDelivery: false }
    ]
  },
  {
    city: "New Delhi",
    state: "Delhi",
    district: "New Delhi",
    localities: [
      { name: "Connaught Place (Inner Circle)", pincode: "110001", hasDelivery: true },
      { name: "Hauz Khas Village & Enclave", pincode: "110016", hasDelivery: true },
      { name: "Greater Kailash I & II (M Block)", pincode: "110048", hasDelivery: true },
      { name: "Vasant Vihar & Chanakyapuri", pincode: "110057", hasDelivery: true },
      { name: "Defence Colony Main Market", pincode: "110024", hasDelivery: true },
      { name: "Karol Bagh & Rajinder Nagar", pincode: "110005", hasDelivery: true }
    ]
  },
  {
    city: "Gurugram",
    state: "Haryana",
    district: "Gurugram",
    localities: [
      { name: "Cyber Hub & DLF Phase 2", pincode: "122002", hasDelivery: true },
      { name: "Golf Course Road (DLF Phase 5)", pincode: "122011", hasDelivery: true },
      { name: "Sector 29 Market", pincode: "122009", hasDelivery: true },
      { name: "Sohna Road (Subhash Chowk)", pincode: "122018", hasDelivery: true }
    ]
  },
  {
    city: "Hyderabad",
    state: "Telangana",
    district: "Hyderabad",
    localities: [
      { name: "Jubilee Hills Checkpost", pincode: "500033", hasDelivery: true },
      { name: "Banjara Hills Road No. 12", pincode: "500034", hasDelivery: true },
      { name: "Gachibowli & Financial District", pincode: "500032", hasDelivery: true },
      { name: "Madhapur (Hitec City)", pincode: "500081", hasDelivery: true }
    ]
  },
  {
    city: "Pune",
    state: "Maharashtra",
    district: "Pune",
    localities: [
      { name: "Koregaon Park (North Main Rd)", pincode: "411001", hasDelivery: true },
      { name: "Kalyani Nagar", pincode: "411006", hasDelivery: true },
      { name: "Baner Balewadi High Street", pincode: "411045", hasDelivery: true },
      { name: "Viman Nagar", pincode: "411014", hasDelivery: true }
    ]
  }
];

// Helper functions
export function getDistrictsForState(stateName: string): string[] {
  const state = INDIA_STATES_AND_UTS.find(s => s.name.toLowerCase() === stateName.toLowerCase());
  return state ? state.districts : [];
}

export function searchLocations(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: {
    title: string;
    subtitle: string;
    pincode: string;
    city: string;
    state: string;
    district: string;
    locality: string;
    hasDelivery: boolean;
  }[] = [];

  // Search through hubs and localities first
  for (const hub of CRAVE_DELIVERY_HUBS) {
    for (const loc of hub.localities) {
      if (
        loc.name.toLowerCase().includes(q) ||
        loc.pincode.includes(q) ||
        hub.city.toLowerCase().includes(q) ||
        hub.state.toLowerCase().includes(q)
      ) {
        results.push({
          title: loc.name,
          subtitle: `${hub.city}, ${hub.state} - PIN ${loc.pincode}`,
          pincode: loc.pincode,
          city: hub.city,
          state: hub.state,
          district: hub.district,
          locality: loc.name,
          hasDelivery: loc.hasDelivery
        });
      }
    }
  }

  // Also check states and districts
  for (const s of INDIA_STATES_AND_UTS) {
    if (s.name.toLowerCase().includes(q)) {
      results.push({
        title: s.name,
        subtitle: `${s.isUnionTerritory ? 'Union Territory' : 'State'}, India (Select district to explore delivery coverage)`,
        pincode: "",
        city: s.name,
        state: s.name,
        district: s.districts[0] || "",
        locality: s.name,
        hasDelivery: CRAVE_DELIVERY_HUBS.some(h => h.state.toLowerCase() === s.name.toLowerCase())
      });
    }

    for (const dist of s.districts) {
      if (dist.toLowerCase().includes(q)) {
        results.push({
          title: `${dist} District`,
          subtitle: `${s.name}, India`,
          pincode: "",
          city: dist,
          state: s.name,
          district: dist,
          locality: dist,
          hasDelivery: CRAVE_DELIVERY_HUBS.some(h => h.district.toLowerCase() === dist.toLowerCase())
        });
      }
    }
  }

  // Deduplicate and limit
  return results.slice(0, 10);
}

export function verifyPincodeCoverage(pincode: string): { covered: boolean; hub?: CityHub; locality?: string } {
  const cleanPin = pincode.trim();
  for (const hub of CRAVE_DELIVERY_HUBS) {
    const loc = hub.localities.find(l => l.pincode === cleanPin && l.hasDelivery);
    if (loc) {
      return { covered: true, hub, locality: loc.name };
    }
  }
  return { covered: false };
}

export const checkPincodeDelivery = verifyPincodeCoverage;
