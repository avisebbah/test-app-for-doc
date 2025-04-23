"use client"

import type React from "react"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, Trash2, Download, Save, Eye, Pen, CheckSquare, PhoneIcon as WhatsappIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import SignatureCanvas from "react-signature-canvas"
import { RichTextEditor } from "@/components/rich-text-editor"

// Mock medication database with extended information
const medicationDatabase = [
  {
    id: "1",
    name: "אקמול",
    genericName: "פראצטמול",
    strength: '500 מ"ג',
    form: "טבליות",
    category: "משככי כאבים",
    code: "ACM500",
    contents: "30 טבליות",
    ingredients: ['פראצטמול 500 מ"ג', "עמילן", "לקטוז"],
    standardDosage: "טבליה אחת כל 6-8 שעות לפי הצורך, לא יותר מ-4 טבליות ביום",
    manufacturer: "טבע",
    imageUrl: "/placeholder.svg?height=100&width=200",
  },
  {
    id: "2",
    name: "אדויל",
    genericName: "איבופרופן",
    strength: '200 מ"ג',
    form: "טבליות",
    category: "משככי כאבים",
    code: "ADV200",
    contents: "24 טבליות",
    ingredients: ['איבופרופן 200 מ"ג', "עמילן", "סוכרוז"],
    standardDosage: "טבליה אחת או שתיים כל 6-8 שעות לפי הצורך, לא יותר מ-6 טבליות ביום",
    manufacturer: "רפא",
    imageUrl: "/placeholder.svg?height=100&width=200",
  },
  {
    id: "3",
    name: "אומפרדקס",
    genericName: "אומפרזול",
    strength: '20 מ"ג',
    form: "קפסולות",
    category: "מעכבי משאבת פרוטונים",
    code: "OMP20",
    contents: "28 קפסולות",
    ingredients: ['אומפרזול 20 מ"ג', "סוכרוז", "לקטוז"],
    standardDosage: "קפסולה אחת ביום, רצוי לפני הארוחה",
    manufacturer: "אסטרה-זנקה",
    imageUrl: "/placeholder.svg?height=100&width=200",
  },
  {
    id: "4",
    name: "נורופן",
    genericName: "איבופרופן",
    strength: '400 מ"ג',
    form: "טבליות",
    category: "משככי כאבים",
    code: "NRF400",
    contents: "20 טבליות",
    ingredients: ['איבופרופן 400 מ"ג', "עמילן", "סוכרוז"],
    standardDosage: "טבליה אחת כל 6-8 שעות לפי הצורך, לא יותר מ-3 טבליות ביום",
    manufacturer: "רקיט בנקיזר",
    imageUrl: "/placeholder.svg?height=100&width=200",
  },
  {
    id: "5",
    name: "סימבקור",
    genericName: "סימבסטטין",
    strength: '20 מ"ג',
    form: "טבליות",
    category: "סטטינים",
    code: "SMV20",
    contents: "30 טבליות",
    ingredients: ['סימבסטטין 20 מ"ג', "לקטוז", "צלולוז"],
    standardDosage: "טבליה אחת ביום, רצוי בערב",
    manufacturer: "מרק",
    imageUrl: "/placeholder.svg?height=100&width=200",
  },
  {
    id: "6",
    name: "קסנקס",
    genericName: "אלפראזולם",
    strength: '0.5 מ"ג',
    form: "טבליות",
    category: "בנזודיאזפינים",
    code: "XNX05",
    contents: "30 טבליות",
    ingredients: ['אלפראזולם 0.5 מ"ג', "לקטוז", "עמילן"],
    standardDosage: '0.25 עד 0.5 מ"ג שלוש פעמים ביום לפי הצורך',
    manufacturer: "פייזר",
    imageUrl: "/placeholder.svg?height=100&width=200",
  },
]

// Mock contacts for WhatsApp
const contacts = [
  { id: "1", name: "בית מרקחת סופר-פארם", number: "972501234567" },
  { id: "2", name: "בית מרקחת מכבי", number: "972502345678" },
  { id: "3", name: "בית מרקחת כללית", number: "972503456789" },
  { id: "4", name: 'ד"ר כהן', number: "972504567890" },
  { id: "5", name: 'ד"ר לוי', number: "972505678901" },
]

export default function NewPrescription() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("patient")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMedications, setSelectedMedications] = useState<any[]>([])
  const [patientData, setPatientData] = useState({
    firstName: "",
    lastName: "",
    idNumber: "",
    dateOfBirth: "",
    diagnosis: "",
  })
  const [additionalNotes, setAdditionalNotes] = useState("")
  const [signatureType, setSignatureType] = useState("digital")
  const [signatureData, setSignatureData] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [showWhatsAppDialog, setShowWhatsAppDialog] = useState(false)
  const [selectedContact, setSelectedContact] = useState("")
  const [manualNumber, setManualNumber] = useState("")
  const [showNewMedicationDialog, setShowNewMedicationDialog] = useState(false)
  const [newMedication, setNewMedication] = useState({
    name: "",
    genericName: "",
    strength: "",
    form: "",
    category: "",
    code: "",
    contents: "",
    ingredients: [""],
    standardDosage: "",
    manufacturer: "",
  })
  const [medicationFile, setMedicationFile] = useState<File | null>(null)

  const signatureRef = useRef<SignatureCanvas | null>(null)

  const filteredMedications = medicationDatabase.filter(
    (med) =>
      med.name.includes(searchTerm) ||
      med.genericName.includes(searchTerm) ||
      med.code.includes(searchTerm) ||
      med.category.includes(searchTerm),
  )

  const handlePatientChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setPatientData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddMedication = (medication: any) => {
    setSelectedMedications((prev) => [
      ...prev,
      {
        ...medication,
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
      },
    ])
  }

  const handleRemoveMedication = (id: string) => {
    setSelectedMedications((prev) => prev.filter((med) => med.id !== id))
  }

  const handleMedicationChange = (id: string, field: string, value: string) => {
    setSelectedMedications((prev) => prev.map((med) => (med.id === id ? { ...med, [field]: value } : med)))
  }

  const handleNewMedicationChange = (field: string, value: string) => {
    setNewMedication((prev) => ({ ...prev, [field]: value }))
  }

  const handleIngredientChange = (index: number, value: string) => {
    setNewMedication((prev) => {
      const updatedIngredients = [...prev.ingredients]
      updatedIngredients[index] = value
      return { ...prev, ingredients: updatedIngredients }
    })
  }

  const addIngredientField = () => {
    setNewMedication((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, ""],
    }))
  }

  const removeIngredientField = (index: number) => {
    setNewMedication((prev) => {
      const updatedIngredients = [...prev.ingredients]
      updatedIngredients.splice(index, 1)
      return { ...prev, ingredients: updatedIngredients }
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMedicationFile(e.target.files[0])
    }
  }

  const handleAddNewMedication = () => {
    // In a real app, you would upload the file and get a URL
    const newMed = {
      ...newMedication,
      id: `new-${Date.now()}`,
      imageUrl: medicationFile ? URL.createObjectURL(medicationFile) : "/placeholder.svg?height=100&width=200",
    }

    // Add to selected medications
    handleAddMedication(newMed)

    // Reset form
    setNewMedication({
      name: "",
      genericName: "",
      strength: "",
      form: "",
      category: "",
      code: "",
      contents: "",
      ingredients: [""],
      standardDosage: "",
      manufacturer: "",
    })
    setMedicationFile(null)
    setShowNewMedicationDialog(false)
  }

  const handleDigitalSign = () => {
    // In a real app, this would use JWT and PKI for a legal electronic signature
    setSignatureData(`ד"ר ישראלי - חתימה דיגיטלית מאובטחת - ${new Date().toLocaleString("he-IL")}`)
  }

  const handleManualSign = () => {
    if (signatureRef.current) {
      const signatureDataURL = signatureRef.current.toDataURL()
      setSignatureData(signatureDataURL)
    }
  }

  const clearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear()
      setSignatureData("")
    }
  }

  const generatePDF = () => {
    // In a real app, this would generate a PDF using a library like jsPDF or call a server endpoint
    console.log("Generating PDF...")
    // For demo purposes, we'll just show the preview
    setShowPreview(true)
  }

  const saveDraft = () => {
    // In a real app, this would save to IndexedDB/SQLite and sync with backend
    console.log("Saving draft...")

    const prescriptionData = {
      patient: patientData,
      medications: selectedMedications,
      additionalNotes,
      signatureType,
      signatureData,
      status: "draft",
      createdAt: new Date().toISOString(),
    }

    // For demo purposes, we'll just log the data
    console.log("Draft saved:", prescriptionData)

    // Show success message
    alert("טיוטת המרשם נשמרה בהצלחה")
  }

  const sendWhatsApp = () => {
    // In a real app, this would use WhatsApp Business API or URL scheme
    const phoneNumber = selectedContact || manualNumber

    if (!phoneNumber) {
      alert("נא לבחור איש קשר או להזין מספר טלפון")
      return
    }

    // For demo purposes, we'll just log the data
    console.log("Sending prescription via WhatsApp to:", phoneNumber)

    // Close dialog
    setShowWhatsAppDialog(false)

    // Show success message
    alert("המרשם נשלח בהצלחה")
  }

  const handleSubmit = () => {
    // Here you would normally send the data to your backend
    console.log("Prescription Data:", {
      patient: patientData,
      medications: selectedMedications,
      additionalNotes,
      signatureType,
      signatureData,
    })

    // Navigate to the success page or history page
    router.push("/prescriptions/history")
  }

  const isPatientInfoComplete = () => {
    return patientData.firstName && patientData.lastName && patientData.idNumber && patientData.dateOfBirth
  }

  const isMedicationInfoComplete = () => {
    return (
      selectedMedications.length > 0 && selectedMedications.every((med) => med.dosage && med.frequency && med.duration)
    )
  }

  const isSignatureComplete = () => {
    return signatureData !== ""
  }

  const canSubmit = isPatientInfoComplete() && isMedicationInfoComplete() && isSignatureComplete()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">יצירת מרשם חדש</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="patient">פרטי מטופל</TabsTrigger>
          <TabsTrigger value="medication" disabled={!isPatientInfoComplete()}>
            בחירת תרופות
          </TabsTrigger>
          <TabsTrigger value="signature" disabled={!isPatientInfoComplete() || !isMedicationInfoComplete()}>
            הערות וחתימה
          </TabsTrigger>
        </TabsList>

        <TabsContent value="patient">
          <Card>
            <CardHeader>
              <CardTitle>פרטי המטופל</CardTitle>
              <CardDescription>הזן את פרטי המטופל עבור המרשם</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">שם פרטי</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={patientData.firstName}
                    onChange={handlePatientChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">שם משפחה</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={patientData.lastName}
                    onChange={handlePatientChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="idNumber">מספר תעודת זהות</Label>
                  <Input
                    id="idNumber"
                    name="idNumber"
                    value={patientData.idNumber}
                    onChange={handlePatientChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">תאריך לידה</Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={patientData.dateOfBirth}
                    onChange={handlePatientChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="diagnosis">אבחנה</Label>
                <Textarea
                  id="diagnosis"
                  name="diagnosis"
                  value={patientData.diagnosis}
                  onChange={handlePatientChange}
                  placeholder="הזן אבחנה רפואית (אופציונלי)"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => setActiveTab("medication")} disabled={!isPatientInfoComplete()}>
                המשך לבחירת תרופות
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="medication">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>חיפוש תרופות</CardTitle>
                  <CardDescription>חפש תרופות במאגר לפי שם, קטגוריה או קוד</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="חפש תרופה..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button variant="ghost" size="icon">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="border rounded-md h-[400px] overflow-y-auto">
                    {filteredMedications.length > 0 ? (
                      <div className="divide-y">
                        {filteredMedications.map((med) => (
                          <div key={med.id} className="p-3 hover:bg-gray-50">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">{med.name}</p>
                                <p className="text-sm text-gray-500">
                                  {med.genericName}, {med.strength}, {med.form}
                                </p>
                                <div className="flex items-center mt-1 space-x-1">
                                  <Badge variant="outline" className="text-xs">
                                    {med.category}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    קוד: {med.code}
                                  </Badge>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleAddMedication(med)}
                                disabled={selectedMedications.some((m) => m.id === med.id)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>

                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="link" size="sm" className="mt-1 h-auto p-0">
                                  הצג פרטים נוספים
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-80">
                                <div className="space-y-2">
                                  <h4 className="font-medium">
                                    {med.name} ({med.genericName})
                                  </h4>
                                  <div className="grid grid-cols-2 gap-1 text-sm">
                                    <span className="text-gray-500">יצרן:</span>
                                    <span>{med.manufacturer}</span>
                                    <span className="text-gray-500">תכולה:</span>
                                    <span>{med.contents}</span>
                                  </div>
                                  <div className="text-sm">
                                    <p className="text-gray-500">מרכיבים:</p>
                                    <ul className="list-disc list-inside">
                                      {med.ingredients.map((ingredient, idx) => (
                                        <li key={idx}>{ingredient}</li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div className="text-sm">
                                    <p className="text-gray-500">מינון מקובל:</p>
                                    <p>{med.standardDosage}</p>
                                  </div>
                                  <div className="mt-2">
                                    <img
                                      src={med.imageUrl || "/placeholder.svg"}
                                      alt={med.name}
                                      className="w-full h-auto border rounded"
                                    />
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-500">לא נמצאו תרופות התואמות לחיפוש</div>
                    )}
                  </div>

                  <Button variant="outline" className="w-full" onClick={() => setShowNewMedicationDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    הוסף תרופה חדשה
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>תרופות נבחרות</CardTitle>
                  <CardDescription>הגדר מינון והוראות לתרופות שנבחרו</CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedMedications.length > 0 ? (
                    <div className="space-y-6">
                      {selectedMedications.map((med) => (
                        <div key={med.id} className="border rounded-md p-4">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-medium">{med.name}</h3>
                              <p className="text-sm text-gray-500">
                                {med.genericName}, {med.strength}, {med.form}
                              </p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => handleRemoveMedication(med.id)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="space-y-2">
                              <Label htmlFor={`dosage-${med.id}`}>מינון</Label>
                              <Input
                                id={`dosage-${med.id}`}
                                value={med.dosage}
                                onChange={(e) => handleMedicationChange(med.id, "dosage", e.target.value)}
                                placeholder="לדוגמה: טבליה אחת"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`frequency-${med.id}`}>תדירות</Label>
                              <Select
                                value={med.frequency}
                                onValueChange={(value) => handleMedicationChange(med.id, "frequency", value)}
                              >
                                <SelectTrigger id={`frequency-${med.id}`}>
                                  <SelectValue placeholder="בחר תדירות" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="once-daily">פעם ביום</SelectItem>
                                  <SelectItem value="twice-daily">פעמיים ביום</SelectItem>
                                  <SelectItem value="three-times-daily">שלוש פעמים ביום</SelectItem>
                                  <SelectItem value="four-times-daily">ארבע פעמים ביום</SelectItem>
                                  <SelectItem value="as-needed">לפי הצורך</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`duration-${med.id}`}>משך הטיפול</Label>
                              <Select
                                value={med.duration}
                                onValueChange={(value) => handleMedicationChange(med.id, "duration", value)}
                              >
                                <SelectTrigger id={`duration-${med.id}`}>
                                  <SelectValue placeholder="בחר משך" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="3-days">3 ימים</SelectItem>
                                  <SelectItem value="5-days">5 ימים</SelectItem>
                                  <SelectItem value="7-days">שבוע</SelectItem>
                                  <SelectItem value="14-days">שבועיים</SelectItem>
                                  <SelectItem value="30-days">חודש</SelectItem>
                                  <SelectItem value="chronic">טיפול קבוע</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`instructions-${med.id}`}>הוראות שימוש</Label>
                            <Textarea
                              id={`instructions-${med.id}`}
                              value={med.instructions}
                              onChange={(e) => handleMedicationChange(med.id, "instructions", e.target.value)}
                              placeholder="הוראות נוספות למטופל"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-8 border rounded-md bg-gray-50">
                      <p className="text-gray-500">לא נבחרו תרופות עדיין</p>
                      <p className="text-sm text-gray-400">חפש ובחר תרופות מהרשימה או הוסף תרופה חדשה</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setActiveTab("patient")}>
                    חזור לפרטי מטופל
                  </Button>
                  <Button onClick={() => setActiveTab("signature")} disabled={!isMedicationInfoComplete()}>
                    המשך להערות וחתימה
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="signature">
          <Card>
            <CardHeader>
              <CardTitle>הערות נוספות וחתימה</CardTitle>
              <CardDescription>הוסף הערות נוספות וחתום על המרשם</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="additionalNotes">הערות והמלצות נוספות</Label>
                <RichTextEditor
                  value={additionalNotes}
                  onChange={setAdditionalNotes}
                  placeholder="הוסף הערות והמלצות נוספות למטופל..."
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">חתימה</h3>

                <Tabs value={signatureType} onValueChange={setSignatureType} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="digital">חתימה דיגיטלית</TabsTrigger>
                    <TabsTrigger value="manual">חתימה ידנית</TabsTrigger>
                  </TabsList>

                  <TabsContent value="digital" className="space-y-4">
                    <div className="p-4 border rounded-md bg-gray-50">
                      <p className="text-sm text-gray-500 mb-4">
                        חתימה דיגיטלית מאובטחת באמצעות JWT ו-PKI. החתימה תכלול את פרטי הזיהוי שלך ואת חותמת הזמן.
                      </p>
                      <Button onClick={handleDigitalSign}>
                        <CheckSquare className="h-4 w-4 mr-2" />
                        חתום דיגיטלית
                      </Button>
                    </div>

                    {signatureType === "digital" && signatureData && (
                      <div className="p-4 border rounded-md bg-blue-50">
                        <p className="font-medium text-blue-700">{signatureData}</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="manual" className="space-y-4">
                    <div className="border rounded-md p-4">
                      <p className="text-sm text-gray-500 mb-2">חתום באמצעות העכבר או מסך המגע:</p>
                      <div className="border rounded-md bg-white">
                        <SignatureCanvas
                          ref={signatureRef}
                          canvasProps={{
                            width: 500,
                            height: 200,
                            className: "signature-canvas w-full h-[200px] border rounded-md",
                          }}
                        />
                      </div>
                      <div className="flex space-x-2 mt-2">
                        <Button variant="outline" size="sm" onClick={clearSignature}>
                          נקה
                        </Button>
                        <Button size="sm" onClick={handleManualSign}>
                          <Pen className="h-4 w-4 mr-2" />
                          שמור חתימה
                        </Button>
                      </div>
                    </div>

                    {signatureType === "manual" && signatureData && (
                      <div className="p-4 border rounded-md">
                        <p className="text-sm text-gray-500 mb-2">החתימה שנשמרה:</p>
                        <img src={signatureData || "/placeholder.svg"} alt="חתימה" className="border rounded-md" />
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => setActiveTab("medication")}>
                חזור לבחירת תרופות
              </Button>
              <div className="flex-1"></div>
              <Button variant="outline" onClick={saveDraft}>
                <Save className="h-4 w-4 mr-2" />
                שמור טיוטה
              </Button>
              <Button variant="outline" onClick={generatePDF} disabled={!canSubmit}>
                <Eye className="h-4 w-4 mr-2" />
                תצוגה מקדימה
              </Button>
              <Button variant="outline" onClick={() => setShowWhatsAppDialog(true)} disabled={!canSubmit}>
                <WhatsappIcon className="h-4 w-4 mr-2" />
                שלח ב-WhatsApp
              </Button>
              <Button onClick={handleSubmit} disabled={!canSubmit}>
                שמור מרשם
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New Medication Dialog */}
      <Dialog open={showNewMedicationDialog} onOpenChange={setShowNewMedicationDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>הוספת תרופה חדשה</DialogTitle>
            <DialogDescription>הזן את פרטי התרופה החדשה שברצונך להוסיף למאגר</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="med-name">שם התרופה</Label>
              <Input
                id="med-name"
                value={newMedication.name}
                onChange={(e) => handleNewMedicationChange("name", e.target.value)}
                placeholder="שם התרופה"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="med-generic">שם גנרי</Label>
              <Input
                id="med-generic"
                value={newMedication.genericName}
                onChange={(e) => handleNewMedicationChange("genericName", e.target.value)}
                placeholder="שם גנרי"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="med-strength">חוזק</Label>
              <Input
                id="med-strength"
                value={newMedication.strength}
                onChange={(e) => handleNewMedicationChange("strength", e.target.value)}
                placeholder='לדוגמה: 500 מ"ג'
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="med-form">צורה</Label>
              <Select value={newMedication.form} onValueChange={(value) => handleNewMedicationChange("form", value)}>
                <SelectTrigger id="med-form">
                  <SelectValue placeholder="בחר צורה" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="טבליות">טבליות</SelectItem>
                  <SelectItem value="קפסולות">קפסולות</SelectItem>
                  <SelectItem value="סירופ">סירופ</SelectItem>
                  <SelectItem value="משחה">משחה</SelectItem>
                  <SelectItem value="טיפות">טיפות</SelectItem>
                  <SelectItem value="זריקות">זריקות</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="med-category">קטגוריה</Label>
              <Input
                id="med-category"
                value={newMedication.category}
                onChange={(e) => handleNewMedicationChange("category", e.target.value)}
                placeholder="קטגוריה"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="med-code">קוד תרופה</Label>
              <Input
                id="med-code"
                value={newMedication.code}
                onChange={(e) => handleNewMedicationChange("code", e.target.value)}
                placeholder="קוד תרופה"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="med-contents">תכולה</Label>
              <Input
                id="med-contents"
                value={newMedication.contents}
                onChange={(e) => handleNewMedicationChange("contents", e.target.value)}
                placeholder="לדוגמה: 30 טבליות"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="med-manufacturer">יצרן</Label>
              <Input
                id="med-manufacturer"
                value={newMedication.manufacturer}
                onChange={(e) => handleNewMedicationChange("manufacturer", e.target.value)}
                placeholder="שם היצרן"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="med-dosage">מינון מקובל</Label>
              <Textarea
                id="med-dosage"
                value={newMedication.standardDosage}
                onChange={(e) => handleNewMedicationChange("standardDosage", e.target.value)}
                placeholder="הוראות מינון מקובלות"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center justify-between">
                <Label>מרכיבים</Label>
                <Button type="button" variant="ghost" size="sm" onClick={addIngredientField}>
                  <Plus className="h-4 w-4 mr-1" />
                  הוסף מרכיב
                </Button>
              </div>

              <div className="space-y-2">
                {newMedication.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={ingredient}
                      onChange={(e) => handleIngredientChange(index, e.target.value)}
                      placeholder={`מרכיב ${index + 1}`}
                    />
                    {newMedication.ingredients.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeIngredientField(index)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="med-file">צרף קובץ/תמונה</Label>
              <div className="flex items-center space-x-2">
                <Input id="med-file" type="file" onChange={handleFileChange} className="flex-1" />
                {medicationFile && (
                  <Button type="button" variant="ghost" size="icon" onClick={() => setMedicationFile(null)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </div>
              <p className="text-xs text-gray-500">ניתן לצרף תמונה של התרופה, תו תקן יצרן או מסמך אחר</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewMedicationDialog(false)}>
              ביטול
            </Button>
            <Button onClick={handleAddNewMedication}>הוסף תרופה</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* WhatsApp Dialog */}
      <Dialog open={showWhatsAppDialog} onOpenChange={setShowWhatsAppDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>שליחת מרשם ב-WhatsApp</DialogTitle>
            <DialogDescription>בחר איש קשר או הזן מספר טלפון לשליחת המרשם</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>בחר מרשימת אנשי קשר</Label>
              <Select value={selectedContact} onValueChange={setSelectedContact}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר איש קשר" />
                </SelectTrigger>
                <SelectContent>
                  {contacts.map((contact) => (
                    <SelectItem key={contact.id} value={contact.number}>
                      {contact.name} ({contact.number})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center">
              <div className="flex-grow h-px bg-gray-200"></div>
              <span className="px-2 text-gray-400 text-sm">או</span>
              <div className="flex-grow h-px bg-gray-200"></div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone-number">הזן מספר טלפון</Label>
              <Input
                id="phone-number"
                value={manualNumber}
                onChange={(e) => setManualNumber(e.target.value)}
                placeholder="הזן מספר טלפון כולל קידומת מדינה"
              />
              <p className="text-xs text-gray-500">לדוגמה: 972501234567 (ללא סימן + בהתחלה)</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowWhatsAppDialog(false)}>
              ביטול
            </Button>
            <Button onClick={sendWhatsApp}>
              <WhatsappIcon className="h-4 w-4 mr-2" />
              שלח מרשם
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>תצוגה מקדימה של המרשם</DialogTitle>
            <DialogDescription>כך ייראה המרשם בעת שליחתו או הדפסתו</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="border rounded-lg p-6 bg-white">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold">מרשם רפואי</h2>
                  <p className="text-sm text-gray-500">תאריך: {new Date().toLocaleDateString("he-IL")}</p>
                </div>
                <div className="text-left">
                  <p className="font-bold">ד"ר ישראלי</p>
                  <p className="text-sm">רישיון מס': 12345</p>
                  <p className="text-sm">טל': 03-1234567</p>
                </div>
              </div>

              <div className="mb-6 p-4 border-t border-b">
                <h3 className="font-medium mb-2">פרטי המטופל:</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p>
                    <span className="font-medium">שם:</span> {patientData.firstName} {patientData.lastName}
                  </p>
                  <p>
                    <span className="font-medium">ת.ז.:</span> {patientData.idNumber}
                  </p>
                  <p>
                    <span className="font-medium">תאריך לידה:</span> {patientData.dateOfBirth}
                  </p>
                </div>
                {patientData.diagnosis && (
                  <div className="mt-2 text-sm">
                    <p>
                      <span className="font-medium">אבחנה:</span> {patientData.diagnosis}
                    </p>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <h3 className="font-medium mb-2">תרופות:</h3>
                <div className="space-y-4">
                  {selectedMedications.map((med, index) => (
                    <div key={med.id} className="p-3 border rounded-md">
                      <p className="font-medium">
                        {index + 1}. {med.name} ({med.genericName}), {med.strength}, {med.form}
                      </p>
                      <div className="text-sm mt-1">
                        <p>
                          <span className="font-medium">מינון:</span> {med.dosage}
                        </p>
                        <p>
                          <span className="font-medium">תדירות:</span>{" "}
                          {{
                            "once-daily": "פעם ביום",
                            "twice-daily": "פעמיים ביום",
                            "three-times-daily": "שלוש פעמים ביום",
                            "four-times-daily": "ארבע פעמים ביום",
                            "as-needed": "לפי הצורך",
                          }[med.frequency] || med.frequency}
                        </p>
                        <p>
                          <span className="font-medium">משך הטיפול:</span>{" "}
                          {{
                            "3-days": "3 ימים",
                            "5-days": "5 ימים",
                            "7-days": "שבוע",
                            "14-days": "שבועיים",
                            "30-days": "חודש",
                            chronic: "טיפול קבוע",
                          }[med.duration] || med.duration}
                        </p>
                        {med.instructions && (
                          <p>
                            <span className="font-medium">הוראות שימוש:</span> {med.instructions}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {additionalNotes && (
                <div className="mb-6">
                  <h3 className="font-medium mb-2">הערות והמלצות נוספות:</h3>
                  <div
                    className="p-3 border rounded-md text-sm"
                    dangerouslySetInnerHTML={{ __html: additionalNotes }}
                  />
                </div>
              )}

              <div className="mt-8 flex justify-end">
                <div className="text-center">
                  <div className="mb-2">
                    {signatureType === "digital" ? (
                      <p className="text-sm font-medium text-blue-700">{signatureData}</p>
                    ) : (
                      signatureData && <img src={signatureData || "/placeholder.svg"} alt="חתימה" className="h-16" />
                    )}
                  </div>
                  <p className="text-sm font-medium">ד"ר ישראלי</p>
                  <p className="text-xs text-gray-500">חתימה וחותמת הרופא</p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              סגור
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              הורד PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
