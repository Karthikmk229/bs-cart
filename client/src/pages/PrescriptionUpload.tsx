// src/pages/PrescriptionUpload.tsx
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Prescription } from '../types';
import { ShieldCheck, ShieldAlert, Loader2, CloudUpload, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const PrescriptionUpload: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // File upload states
  const [file, setFile] = useState<File | null>(null);
  const [doctorName, setDoctorName] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);

  const fetchPrescriptions = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/prescriptions');
      setPrescriptions(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    if (doctorName) {
      formData.append('doctorName', doctorName);
    }

    try {
      await api.post('/prescriptions', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Prescription uploaded successfully!');
      setFile(null);
      setDoctorName('');
      await fetchPrescriptions();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Prescriptions</h1>
        <p className="text-xs text-slate-400 mt-0.5">Upload doctor prescriptions to buy Rx-required medical items.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Upload Wizard */}
        <div className="bg-white rounded-3xl border border-slate-100 p-5 space-y-4 shadow-xs h-fit">
          <h3 className="font-extrabold text-slate-800 text-sm">Upload New Prescription</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Doctor/Clinic Name</label>
              <input
                type="text"
                placeholder="Dr. Rajesh Kumar, Apollo Clinic"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center space-y-2 hover:border-brand-500 hover:bg-slate-50/50 transition-colors cursor-pointer relative">
              <input
                type="file"
                accept="image/*,.pdf"
                required
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <CloudUpload className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs font-semibold text-slate-600">
                {file ? file.name : 'Select Prescription Document'}
              </p>
              <p className="text-[10px] text-slate-400">PDF, JPG, JPEG, or PNG up to 5MB</p>
            </div>

            <button
              type="submit"
              disabled={uploading || !file}
              className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl bg-brand-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-brand-700 disabled:opacity-40 transition-all shadow-md shadow-brand-100"
            >
              {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
              Upload Document
            </button>
          </form>
        </div>

        {/* Existing Prescriptions Grid */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-extrabold text-slate-800 text-sm">Upload History</h3>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
            </div>
          ) : prescriptions.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
              <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-400">No prescriptions uploaded yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prescriptions.map((rx) => {
                const isApproved = rx.status === 'approved';
                const isPending = rx.status === 'pending';
                return (
                  <div
                    key={rx.id}
                    className="bg-white rounded-2xl border border-slate-100 p-4 flex flex-col justify-between gap-4 shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <strong className="font-bold text-slate-800 text-sm truncate block">{rx.doctorName || 'Dr. Unknown'}</strong>
                        <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Uploaded: {new Date(rx.uploadedAt).toLocaleDateString('en-IN')}</span>
                      </div>
                      
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        isApproved
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                          : isPending
                          ? 'bg-amber-50 text-amber-800 border border-amber-100'
                          : 'bg-red-50 text-red-800 border border-red-100'
                      }`}>
                        {rx.status.toUpperCase()}
                      </span>
                    </div>

                    {rx.adminRemarks && (
                      <p className="text-[10px] bg-slate-50 rounded-lg p-2 text-slate-500 border border-slate-100">
                        <strong>Review Note:</strong> {rx.adminRemarks}
                      </p>
                    )}

                    {/* Image View Link */}
                    <a
                      href={`http://localhost:4000${rx.imageUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-brand-600 hover:text-brand-850 flex items-center gap-1 self-start"
                    >
                      View Uploaded Document →
                    </a>

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
