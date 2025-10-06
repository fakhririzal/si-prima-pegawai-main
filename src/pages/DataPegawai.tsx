import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import { z } from "zod";

const employeeSchema = z.object({
  nama: z.string().min(1, "Nama wajib diisi").max(100),
  nip: z.string().min(1, "NIP wajib diisi").max(50),
  jenis_kelamin: z.string().min(1, "Jenis kelamin wajib dipilih"),
  pangkat_golongan: z.string().min(1, "Pangkat/Golongan wajib diisi").max(100),
  tmt_pangkat_golongan: z.string().min(1, "TMT Pangkat/Golongan wajib diisi"),
  jabatan: z.string().min(1, "Jabatan wajib diisi").max(150),
  tmt_cpns: z.string().min(1, "TMT CPNS wajib diisi"),
  tmt_pns: z.string().min(1, "TMT PNS wajib diisi"),
  pendidikan_terakhir: z.string().min(1, "Pendidikan terakhir wajib diisi").max(100),
  tempat_lahir: z.string().min(1, "Tempat lahir wajib diisi").max(100),
  tanggal_lahir: z.string().min(1, "Tanggal lahir wajib diisi"),
  kapgek: z.string().max(100).optional(),
});

const DataPegawai = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nama: "",
    nip: "",
    jenis_kelamin: "",
    pangkat_golongan: "",
    tmt_pangkat_golongan: "",
    jabatan: "",
    tmt_cpns: "",
    tmt_pns: "",
    pendidikan_terakhir: "",
    tempat_lahir: "",
    tanggal_lahir: "",
    kapgek: "",
  });

  useEffect(() => {
    if (editId) {
      fetchEmployee(editId);
    }
  }, [editId]);

  const fetchEmployee = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("employees")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      setFormData({
        nama: data.nama,
        nip: data.nip,
        jenis_kelamin: data.jenis_kelamin,
        pangkat_golongan: data.pangkat_golongan,
        tmt_pangkat_golongan: data.tmt_pangkat_golongan,
        jabatan: data.jabatan,
        tmt_cpns: data.tmt_cpns,
        tmt_pns: data.tmt_pns,
        pendidikan_terakhir: data.pendidikan_terakhir,
        tempat_lahir: data.tempat_lahir,
        tanggal_lahir: data.tanggal_lahir,
        kapgek: data.kapgek || "",
      });
    } catch (error: any) {
      toast.error("Gagal memuat data pegawai");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validated = employeeSchema.parse(formData);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      if (editId) {
        const { error } = await supabase
          .from("employees")
          .update({
            ...validated,
            kapgek: validated.kapgek || null,
          })
          .eq("id", editId);

        if (error) throw error;
        toast.success("Data pegawai berhasil diperbarui");
      } else {
        const insertData = {
          nama: validated.nama,
          nip: validated.nip,
          jenis_kelamin: validated.jenis_kelamin,
          pangkat_golongan: validated.pangkat_golongan,
          tmt_pangkat_golongan: validated.tmt_pangkat_golongan,
          jabatan: validated.jabatan,
          tmt_cpns: validated.tmt_cpns,
          tmt_pns: validated.tmt_pns,
          pendidikan_terakhir: validated.pendidikan_terakhir,
          tempat_lahir: validated.tempat_lahir,
          tanggal_lahir: validated.tanggal_lahir,
          kapgek: validated.kapgek || null,
          user_id: user.id,
        };

        const { error } = await supabase.from("employees").insert(insertData);

        if (error) throw error;
        toast.success("Data pegawai berhasil ditambahkan");
      }

      navigate("/dashboard");
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error(error.message || "Gagal menyimpan data");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{editId ? "Edit Data Pegawai" : "Tambah Data Pegawai"}</CardTitle>
          <CardDescription>
            {editId ? "Perbarui informasi pegawai" : "Lengkapi formulir di bawah ini"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nama">Nama *</Label>
                <Input
                  id="nama"
                  value={formData.nama}
                  onChange={(e) => handleChange("nama", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nip">NIP *</Label>
                <Input
                  id="nip"
                  value={formData.nip}
                  onChange={(e) => handleChange("nip", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="jenis_kelamin">Jenis Kelamin *</Label>
                <Select
                  value={formData.jenis_kelamin}
                  onValueChange={(value) => handleChange("jenis_kelamin", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis kelamin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                    <SelectItem value="Perempuan">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pangkat_golongan">Pangkat/Golongan Ruang *</Label>
                <Input
                  id="pangkat_golongan"
                  value={formData.pangkat_golongan}
                  onChange={(e) => handleChange("pangkat_golongan", e.target.value)}
                  placeholder="Contoh: Penata / III/c"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tmt_pangkat_golongan">TMT Pangkat/Golongan Ruang *</Label>
                <Input
                  id="tmt_pangkat_golongan"
                  type="date"
                  value={formData.tmt_pangkat_golongan}
                  onChange={(e) => handleChange("tmt_pangkat_golongan", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="jabatan">Jabatan *</Label>
                <Input
                  id="jabatan"
                  value={formData.jabatan}
                  onChange={(e) => handleChange("jabatan", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tmt_cpns">TMT CPNS *</Label>
                <Input
                  id="tmt_cpns"
                  type="date"
                  value={formData.tmt_cpns}
                  onChange={(e) => handleChange("tmt_cpns", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tmt_pns">TMT PNS *</Label>
                <Input
                  id="tmt_pns"
                  type="date"
                  value={formData.tmt_pns}
                  onChange={(e) => handleChange("tmt_pns", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pendidikan_terakhir">Pendidikan Terakhir *</Label>
                <Input
                  id="pendidikan_terakhir"
                  value={formData.pendidikan_terakhir}
                  onChange={(e) => handleChange("pendidikan_terakhir", e.target.value)}
                  placeholder="Contoh: S1 Kesehatan Masyarakat"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tempat_lahir">Tempat Lahir *</Label>
                <Input
                  id="tempat_lahir"
                  value={formData.tempat_lahir}
                  onChange={(e) => handleChange("tempat_lahir", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tanggal_lahir">Tanggal Lahir *</Label>
                <Input
                  id="tanggal_lahir"
                  type="date"
                  value={formData.tanggal_lahir}
                  onChange={(e) => handleChange("tanggal_lahir", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="kapgek">Kapgek</Label>
                <Input
                  id="kapgek"
                  value={formData.kapgek}
                  onChange={(e) => handleChange("kapgek", e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Menyimpan..." : editId ? "Perbarui" : "Simpan"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard")}
              >
                Batal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataPegawai;
