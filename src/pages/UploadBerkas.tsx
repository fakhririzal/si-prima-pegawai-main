import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload } from "lucide-react";

interface Employee {
  id: string;
  nama: string;
  nip: string;
}

const UploadBerkas = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from("employees")
        .select("id, nama, nip")
        .order("nama");

      if (error) throw error;
      setEmployees(data || []);
    } catch (error: any) {
      toast.error("Gagal memuat data pegawai");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];

      if (!allowedTypes.includes(selectedFile.type)) {
        toast.error("Format file tidak didukung. Gunakan PDF, Word, atau Excel");
        return;
      }

      if (selectedFile.size > 10485760) {
        toast.error("Ukuran file maksimal 10MB");
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedEmployee) {
      toast.error("Pilih pegawai terlebih dahulu");
      return;
    }

    if (!file) {
      toast.error("Pilih file terlebih dahulu");
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const fileExt = file.name.split(".").pop();
      const fileName = `${selectedEmployee}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("employee-documents")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase.from("employee_files").insert({
        employee_id: selectedEmployee,
        user_id: user.id,
        file_name: file.name,
        file_path: fileName,
        file_type: file.type,
        file_size: file.size,
      });

      if (dbError) throw dbError;

      toast.success("File berhasil diunggah");
      setFile(null);
      setSelectedEmployee("");
      
      const fileInput = document.getElementById("file-upload") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error: any) {
      toast.error(error.message || "Gagal mengunggah file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Upload Berkas Pegawai</CardTitle>
          <CardDescription>
            Unggah dokumen pegawai (PDF, Word, Excel - maksimal 10MB)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpload} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="employee">Pilih Pegawai *</Label>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee} required>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih pegawai..." />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.nama} - {employee.nip}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="file-upload">File Dokumen *</Label>
              <div className="flex flex-col gap-2">
                <Input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                  required
                />
                {file && (
                  <div className="text-sm text-muted-foreground">
                    File terpilih: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </div>
                )}
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              {loading ? "Mengunggah..." : "Upload File"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadBerkas;
