"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Clock, CheckCircle, AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Mock pharmacy data
const pharmacies = [
  {
    id: "1",
    name: "סופר-פארם רמת אביב",
    address: "אינשטיין 40, תל אביב",
    hours: "08:00-22:00",
    distance: '1.2 ק"מ',
    hasAllMedications: true,
    connected: true,
  },
  {
    id: "2",
    name: "בית מרקחת מכבי - הרצליה",
    address: "סוקולוב 15, הרצליה",
    hours: "08:00-20:00",
    distance: '8.5 ק"מ',
    hasAllMedications: true,
    connected: true,
  },
  {
    id: "3",
    name: "סופר-פארם קניון איילון",
    address: "אבא הלל 301, רמת גן",
    hours: "09:00-22:00",
    distance: '5.3 ק"מ',
    hasAllMedications: false,
    connected: true,
  },
  {
    id: "4",
    name: "בית מרקחת כללית - תל אביב",
    address: "דיזנגוף 50, תל אביב",
    hours: "08:00-19:00",
    distance: '3.7 ק"מ',
    hasAllMedications: true,
    connected: true,
  },
  {
    id: "5",
    name: "בית מרקחת פרטי - גבעתיים",
    address: "כצנלסון 15, גבעתיים",
    hours: "08:00-20:00",
    distance: '6.1 ק"מ',
    hasAllMedications: true,
    connected: false,
  },
]

// Mock prescription data
const pendingPrescriptions = [
  {
    id: "1",
    patientName: "שרה כהן",
    patientId: "987654321",
    date: "2023-05-14",
    medications: ['אומפרדקס 20 מ"ג'],
  },
  {
    id: "2",
    patientName: "משה לוי",
    patientId: "567891234",
    date: "2023-05-16",
    medications: ['אקמול 500 מ"ג', 'אדויל 200 מ"ג'],
  },
]

export default function Pharmacies() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPharmacies, setSelectedPharmacies] = useState<string[]>([])
  const [selectedPrescriptions, setSelectedPrescriptions] = useState<string[]>([])
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)

  // Filter pharmacies based on search term
  const filteredPharmacies = pharmacies.filter(
    (pharmacy) => pharmacy.name.includes(searchTerm) || pharmacy.address.includes(searchTerm),
  )

  const handlePharmacySelection = (pharmacyId: string) => {
    setSelectedPharmacies((prev) =>
      prev.includes(pharmacyId) ? prev.filter((id) => id !== pharmacyId) : [...prev, pharmacyId],
    )
  }

  const handlePrescriptionSelection = (prescriptionId: string) => {
    setSelectedPrescriptions((prev) =>
      prev.includes(prescriptionId) ? prev.filter((id) => id !== prescriptionId) : [...prev, prescriptionId],
    )
  }

  const handleSendPrescriptions = () => {
    // Here you would normally send the data to your backend
    console.log("Sending prescriptions:", {
      prescriptions: selectedPrescriptions,
      pharmacies: selectedPharmacies,
    })

    // Show success dialog
    setShowSuccessDialog(true)
  }

  const canSend = selectedPharmacies.length > 0 && selectedPrescriptions.length > 0

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">שליחת מרשמים לבתי מרקחת</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>בחר בתי מרקחת</CardTitle>
              <CardDescription>בחר בתי מרקחת לשליחת המרשמים</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <Input
                  placeholder="חפש לפי שם או כתובת"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="ghost" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              <Tabs defaultValue="list" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="list">רשימה</TabsTrigger>
                  <TabsTrigger value="map">מפה</TabsTrigger>
                </TabsList>

                <TabsContent value="list">
                  <div className="space-y-4 max-h-[500px] overflow-y-auto">
                    {filteredPharmacies.length > 0 ? (
                      filteredPharmacies.map((pharmacy) => (
                        <div
                          key={pharmacy.id}
                          className={`border rounded-lg p-4 ${
                            selectedPharmacies.includes(pharmacy.id) ? "border-blue-500 bg-blue-50" : "border-gray-200"
                          }`}
                        >
                          <div className="flex items-start">
                            <Checkbox
                              id={`pharmacy-${pharmacy.id}`}
                              checked={selectedPharmacies.includes(pharmacy.id)}
                              onCheckedChange={() => handlePharmacySelection(pharmacy.id)}
                              disabled={!pharmacy.connected}
                              className="mt-1"
                            />
                            <div className="mr-3 flex-1">
                              <div className="flex items-center space-x-2">
                                <Label htmlFor={`pharmacy-${pharmacy.id}`} className="font-medium cursor-pointer">
                                  {pharmacy.name}
                                </Label>
                                {!pharmacy.connected && (
                                  <Badge variant="outline" className="text-gray-500">
                                    לא מחובר
                                  </Badge>
                                )}
                                {!pharmacy.hasAllMedications && (
                                  <Badge variant="outline" className="text-yellow-500">
                                    חסרות תרופות
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center text-sm text-gray-500 mt-1">
                                <MapPin className="h-3.5 w-3.5 mr-1" />
                                <span>{pharmacy.address}</span>
                                <span className="mx-2">•</span>
                                <span>{pharmacy.distance}</span>
                              </div>
                              <div className="flex items-center text-sm text-gray-500 mt-1">
                                <Clock className="h-3.5 w-3.5 mr-1" />
                                <span>שעות פעילות: {pharmacy.hours}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center p-8 border rounded-md bg-gray-50">
                        <p className="text-gray-500">לא נמצאו בתי מרקחת</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="map">
                  <div className="border rounded-lg h-[500px] flex items-center justify-center bg-gray-100">
                    <p className="text-gray-500">מפת בתי מרקחת תוצג כאן</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>מרשמים ממתינים</CardTitle>
              <CardDescription>בחר מרשמים לשליחה</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[300px] overflow-y-auto">
                {pendingPrescriptions.length > 0 ? (
                  pendingPrescriptions.map((prescription) => (
                    <div
                      key={prescription.id}
                      className={`border rounded-lg p-4 ${
                        selectedPrescriptions.includes(prescription.id)
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-start">
                        <Checkbox
                          id={`prescription-${prescription.id}`}
                          checked={selectedPrescriptions.includes(prescription.id)}
                          onCheckedChange={() => handlePrescriptionSelection(prescription.id)}
                          className="mt-1"
                        />
                        <div className="mr-3">
                          <Label htmlFor={`prescription-${prescription.id}`} className="font-medium cursor-pointer">
                            {prescription.patientName}
                          </Label>
                          <p className="text-sm text-gray-500">ת.ז.: {prescription.patientId}</p>
                          <p className="text-sm text-gray-500">תאריך: {prescription.date}</p>
                          <div className="mt-2">
                            <p className="text-sm font-medium">תרופות:</p>
                            <ul className="text-sm text-gray-600 list-disc list-inside">
                              {prescription.medications.map((med, index) => (
                                <li key={index}>{med}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-8 border rounded-md bg-gray-50">
                    <p className="text-gray-500">אין מרשמים ממתינים</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" disabled={!canSend} onClick={handleSendPrescriptions}>
                שלח מרשמים
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>מידע על זמינות תרופות</CardTitle>
              <CardDescription>מידע מעודכן ממערכת ירפא</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">אקמול 500 מ"ג</p>
                    <p className="text-sm text-gray-500">זמין בכל בתי המרקחת שנבחרו</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">אדויל 200 מ"ג</p>
                    <p className="text-sm text-gray-500">זמין בכל בתי המרקחת שנבחרו</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="font-medium">אומפרדקס 20 מ"ג</p>
                    <p className="text-sm text-gray-500">חסר בבית מרקחת "סופר-פארם קניון איילון"</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>המרשמים נשלחו בהצלחה</DialogTitle>
            <DialogDescription>
              המרשמים נשלחו לבתי המרקחת שנבחרו. המטופלים יקבלו הודעה על זמינות התרופות.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              {selectedPharmacies.map((id) => {
                const pharmacy = pharmacies.find((p) => p.id === id)
                return pharmacy ? (
                  <div key={pharmacy.id} className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <p>{pharmacy.name}</p>
                  </div>
                ) : null
              })}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowSuccessDialog(false)}>סגור</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
