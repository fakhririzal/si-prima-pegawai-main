import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download } from "lucide-react";
import { toast } from "sonner";

interface Employee {
  id: string;
  nama: string;
  nip: string;
  jenis_kelamin: string;
  pangkat_golongan: string;
  tmt_pangkat_golongan: string;
  jabatan: string;
  tmt_cpns: string;
  tmt_pns: string;
  pendidikan_terakhir: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  kapgek: string;
}

interface EmployeeFile {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  uploaded_at: string;
}

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [files, setFiles] = useState<EmployeeFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchEmployeeDetails(id);
      fetchEmployeeFiles(id);
    }
  }, [id]);

  const fetchEmployeeDetails = async (employeeId: string) => {
    try {
      const { data, error } = await supabase
        .from("employees")
        .select("*")
        .eq("id", employeeId)
        .single();

      if (error) throw error;
      setEmployee(data);
    } catch (error: any) {
      toast.error("Gagal memuat data pegawai");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeeFiles = async (employeeId: string) => {
    try {
      const { data, error } = await supabase
        .from("employee_files")
        .select("*")
        .eq("employee_id", employeeId)
        .order("uploaded_at", { ascending: false });

      if (error) throw error;
      setFiles(data || []);
    } catch (error: any) {
      console.error("Error fetching files:", error);
    }
  };

  const handleDownload = async (file: EmployeeFile) => {
    try {
      const { data, error } = await supabase.storage
        .from("employee-documents")
        .download(file.file_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error: any) {
      toast.error("Gagal mengunduh file");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!employee) {
    return null;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Detail Pegawai</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Pegawai</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Nama</p>
            <p className="font-medium">{employee.nama}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">NIP</p>
            <p className="font-medium">{employee.nip}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Jenis Kelamin</p>
            <p className="font-medium">{employee.jenis_kelamin}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Jabatan</p>
            <p className="font-medium">{employee.jabatan}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Pangkat/Golongan Ruang</p>
            <p className="font-medium">{employee.pangkat_golongan}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">TMT Pangkat/Golongan Ruang</p>
            <p className="font-medium">{formatDate(employee.tmt_pangkat_golongan)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">TMT CPNS</p>
            <p className="font-medium">{formatDate(employee.tmt_cpns)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">TMT PNS</p>
            <p className="font-medium">{formatDate(employee.tmt_pns)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Pendidikan Terakhir</p>
            <p className="font-medium">{employee.pendidikan_terakhir}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Tempat, Tanggal Lahir</p>
            <p className="font-medium">
              {employee.tempat_lahir}, {formatDate(employee.tanggal_lahir)}
            </p>
          </div>
          {employee.kapgek && (
            <div>
              <p className="text-sm text-muted-foreground">Kapgek</p>
              <p className="font-medium">{employee.kapgek}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Berkas yang Diunggah</CardTitle>
        </CardHeader>
        <CardContent>
          {files.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Belum ada berkas yang diunggah
            </p>
          ) : (
            <div className="space-y-2">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium">{file.file_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(file.file_size)} • {formatDate(file.uploaded_at)}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownload(file)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Unduh
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Detail;
