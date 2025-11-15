export function initializeDemoData() {
  const demoUserId = 'demo-driver-1'
  
  console.log('[v0] Initializing demo data for user:', demoUserId)

  const usersData = localStorage.getItem('autocare_users')
  
  if (usersData) {
    const users = JSON.parse(usersData)
    const demoUser = users.find((u: any) => u.email === 'demo@autocare.com')
    if (demoUser) {
      console.log('[v0] Found demo user with ID:', demoUser.id)
    }
  }

  // Demo vehicles for car owner
  const demoVehicles = [
    {
      id: "vehicle-1",
      userId: demoUserId,
      make: "Toyota",
      model: "Camry",
      year: 2020,
      licensePlate: "ABC-1234",
      mileage: 45320,
      vin: "1HGBH41JXMN109186",
      image: "/toyota-camry-2020.png",
      lastService: "2024-01-15",
      nextService: "Next week",
      healthScore: 78
    },
    {
      id: "vehicle-2",
      userId: demoUserId,
      make: "Honda",
      model: "CR-V",
      year: 2021,
      licensePlate: "XYZ-5678",
      mileage: 28150,
      vin: "2HGBH41JXMN109187",
      image: "/honda-crv-2021.jpg",
      lastService: "2024-02-20",
      nextService: "2 months",
      healthScore: 92
    },
    {
      id: "vehicle-3",
      userId: demoUserId,
      make: "Ford",
      model: "F-150",
      year: 2019,
      licensePlate: "DEF-9012",
      mileage: 67890,
      vin: "3HGBH41JXMN109188",
      image: "/ford-f150-2019.jpg",
      lastService: "2023-12-10",
      nextService: "Next week",
      healthScore: 65
    }
  ]

  // Get today's date for demo bookings
  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]
  const nextWeek = new Date(today)
  nextWeek.setDate(today.getDate() + 7)
  const nextWeekStr = nextWeek.toISOString().split('T')[0]

  // Demo bookings (appointments)
  const demoBookings = [
    {
      id: "booking-1",
      customerId: demoUserId,
      customerName: "John Doe",
      customerEmail: "demo@autocare.com",
      customerPhone: "(555) 123-4567",
      vehicle: "2020 Toyota Camry",
      vehicleId: "vehicle-1",
      service: "Oil Change",
      date: todayStr,
      time: "10:00 AM",
      workshop: "AutoCare Plus Main",
      workshopId: "1",
      notes: "Regular maintenance",
      status: "scheduled",
      createdAt: new Date().toISOString()
    },
    {
      id: "booking-2",
      customerId: demoUserId,
      customerName: "John Doe",
      customerEmail: "demo@autocare.com",
      customerPhone: "(555) 123-4567",
      vehicle: "2021 Honda CR-V",
      vehicleId: "vehicle-2",
      service: "Tire Rotation",
      date: nextWeekStr,
      time: "2:00 PM",
      workshop: "AutoCare Plus Main",
      workshopId: "1",
      notes: "Check tire pressure",
      status: "scheduled",
      createdAt: new Date().toISOString()
    },
    {
      id: "booking-3",
      customerId: "demo-user-2",
      customerName: "Sarah Smith",
      customerEmail: "sarah@example.com",
      customerPhone: "(555) 987-6543",
      vehicle: "2019 Tesla Model 3",
      vehicleId: "vehicle-4",
      service: "Brake Inspection",
      date: todayStr,
      time: "11:30 AM",
      workshop: "AutoCare Plus Main",
      workshopId: "1",
      notes: "Hearing squeaking noise",
      status: "scheduled",
      createdAt: new Date().toISOString()
    },
    {
      id: "booking-4",
      customerId: "demo-user-3",
      customerName: "Mike Johnson",
      customerEmail: "mike@example.com",
      customerPhone: "(555) 456-7890",
      vehicle: "2022 BMW X5",
      vehicleId: "vehicle-5",
      service: "Full Service",
      date: todayStr,
      time: "3:00 PM",
      workshop: "AutoCare Plus Main",
      workshopId: "1",
      notes: "Annual service",
      status: "scheduled",
      createdAt: new Date().toISOString()
    }
  ]

  // Demo invoices (completed services)
  const demoInvoices = [
    {
      id: "inv-1",
      bookingId: "old-booking-1",
      customerId: demoUserId,
      customerEmail: "demo@autocare.com",
      vehicleInfo: "2020 Toyota Camry",
      vehicleId: "vehicle-1",
      workshop: "AutoCare Plus Main",
      workshopId: "1",
      totalPrice: "$245.99",
      parts: "Oil Filter ($15), Motor Oil 5W-30 ($45), Cabin Air Filter ($35)",
      labor: "$60.00",
      notes: "Completed full oil change service and replaced cabin air filter as recommended",
      completedDate: "2024-02-15",
      sentAt: "2024-02-15T10:30:00.000Z"
    },
    {
      id: "inv-2",
      bookingId: "old-booking-2",
      customerId: demoUserId,
      customerEmail: "demo@autocare.com",
      vehicleInfo: "2021 Honda CR-V",
      vehicleId: "vehicle-2",
      workshop: "QuickFix Auto Center",
      workshopId: "2",
      totalPrice: "$189.50",
      parts: "Brake Pads Front ($120)",
      labor: "$69.50",
      notes: "Replaced front brake pads. Rear brakes still have 60% life remaining.",
      completedDate: "2024-01-20",
      sentAt: "2024-01-20T14:15:00.000Z"
    },
    {
      id: "inv-3",
      bookingId: "old-booking-3",
      customerId: demoUserId,
      customerEmail: "demo@autocare.com",
      vehicleInfo: "2019 Ford F-150",
      vehicleId: "vehicle-3",
      workshop: "Elite Motors Workshop",
      workshopId: "3",
      totalPrice: "$95.00",
      parts: "Wiper Blades ($25)",
      labor: "$15.00",
      notes: "Tire rotation completed and replaced wiper blades",
      completedDate: "2023-12-10",
      sentAt: "2023-12-10T09:00:00.000Z"
    }
  ]

  // Demo workshops data
  const demoWorkshops = [
    {
      id: "1",
      name: "AutoCare Plus Main",
      address: "123 Main Street, Downtown",
      city: "San Francisco",
      rating: 4.8,
      reviews: 342,
      distance: "2.3 km",
      lat: 37.7749,
      lng: -122.4194,
      phone: "(555) 100-2000",
      hours: "Mon-Fri: 8:00 AM - 6:00 PM, Sat: 9:00 AM - 4:00 PM",
      services: [
        { name: "Oil Change", price: 89.99, duration: "45 min" },
        { name: "Tire Rotation", price: 49.99, duration: "30 min" },
        { name: "Brake Service", price: 299.99, duration: "2 hours" },
        { name: "Safety Inspection", price: 79.99, duration: "1 hour" },
        { name: "Engine Diagnostics", price: 149.99, duration: "1.5 hours" },
        { name: "Transmission Service", price: 249.99, duration: "2 hours" },
      ]
    },
    {
      id: "2",
      name: "QuickFix Auto Center",
      address: "456 Oak Avenue, Midtown",
      city: "San Francisco",
      rating: 4.6,
      reviews: 215,
      distance: "3.8 km",
      lat: 37.7849,
      lng: -122.4294,
      phone: "(555) 200-3000",
      hours: "Mon-Sat: 7:00 AM - 7:00 PM, Sun: 10:00 AM - 3:00 PM",
      services: [
        { name: "Oil Change", price: 79.99, duration: "30 min" },
        { name: "Tire Rotation", price: 39.99, duration: "30 min" },
        { name: "Brake Service", price: 279.99, duration: "2 hours" },
        { name: "Safety Inspection", price: 69.99, duration: "45 min" },
        { name: "Engine Diagnostics", price: 129.99, duration: "1 hour" },
      ]
    },
    {
      id: "3",
      name: "Elite Motors Workshop",
      address: "789 Pine Street, Financial District",
      city: "San Francisco",
      rating: 4.9,
      reviews: 428,
      distance: "1.5 km",
      lat: 37.7649,
      lng: -122.4094,
      phone: "(555) 300-4000",
      hours: "Mon-Fri: 8:00 AM - 6:00 PM",
      services: [
        { name: "Oil Change", price: 99.99, duration: "1 hour" },
        { name: "Tire Rotation", price: 59.99, duration: "45 min" },
        { name: "Brake Service", price: 349.99, duration: "2.5 hours" },
        { name: "Safety Inspection", price: 89.99, duration: "1 hour" },
        { name: "Engine Diagnostics", price: 179.99, duration: "2 hours" },
        { name: "Transmission Service", price: 299.99, duration: "3 hours" },
      ]
    },
    {
      id: "4",
      name: "Speedy Service Auto",
      address: "321 Elm Boulevard, Sunset District",
      city: "San Francisco",
      rating: 4.5,
      reviews: 189,
      distance: "5.2 km",
      lat: 37.7549,
      lng: -122.4394,
      phone: "(555) 400-5000",
      hours: "Mon-Sat: 8:00 AM - 5:00 PM",
      services: [
        { name: "Oil Change", price: 74.99, duration: "30 min" },
        { name: "Tire Rotation", price: 44.99, duration: "30 min" },
        { name: "Brake Service", price: 259.99, duration: "1.5 hours" },
        { name: "Safety Inspection", price: 64.99, duration: "45 min" },
      ]
    }
  ]

  localStorage.setItem('autocare_vehicles', JSON.stringify(demoVehicles))
  localStorage.setItem('autocare_bookings', JSON.stringify(demoBookings))
  localStorage.setItem('autocare_invoices', JSON.stringify(demoInvoices))
  localStorage.setItem('autocare_workshops', JSON.stringify(demoWorkshops))
  
  console.log('[v0] Demo data initialized successfully')
  console.log('[v0] Vehicles:', demoVehicles.length)
  console.log('[v0] Bookings:', demoBookings.length)
  console.log('[v0] Invoices:', demoInvoices.length)
  console.log('[v0] Workshops:', demoWorkshops.length)
}

export function resetDemoData() {
  localStorage.removeItem('autocare_demo_initialized')
  initializeDemoData()
}
