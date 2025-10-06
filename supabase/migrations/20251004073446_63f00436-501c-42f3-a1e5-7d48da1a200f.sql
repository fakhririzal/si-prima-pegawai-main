-- Create employees table
CREATE TABLE public.employees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  nama TEXT NOT NULL,
  nip TEXT NOT NULL UNIQUE,
  jenis_kelamin TEXT NOT NULL,
  pangkat_golongan TEXT NOT NULL,
  tmt_pangkat_golongan DATE NOT NULL,
  jabatan TEXT NOT NULL,
  tmt_cpns DATE NOT NULL,
  tmt_pns DATE NOT NULL,
  pendidikan_terakhir TEXT NOT NULL,
  tempat_lahir TEXT NOT NULL,
  tanggal_lahir DATE NOT NULL,
  kapgek TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Users can view all employees" 
ON public.employees 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Users can create employees" 
ON public.employees 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own employees" 
ON public.employees 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own employees" 
ON public.employees 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- Create employee_files table for file uploads
CREATE TABLE public.employee_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security for files
ALTER TABLE public.employee_files ENABLE ROW LEVEL SECURITY;

-- Create policies for employee files
CREATE POLICY "Users can view all employee files" 
ON public.employee_files 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Users can upload employee files" 
ON public.employee_files 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own employee files" 
ON public.employee_files 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- Create storage bucket for employee documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'employee-documents',
  'employee-documents',
  false,
  10485760,
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
);

-- Create storage policies
CREATE POLICY "Authenticated users can upload employee documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'employee-documents');

CREATE POLICY "Authenticated users can view employee documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'employee-documents');

CREATE POLICY "Users can delete their own employee documents"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'employee-documents');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_employees_updated_at
BEFORE UPDATE ON public.employees
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();