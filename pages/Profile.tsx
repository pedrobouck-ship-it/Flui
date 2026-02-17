
import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Modal, Input, TextArea, Badge, Skeleton } from '../components/UI';
import { 
  User, Mail, Phone, MapPin, Briefcase, Building, 
  Linkedin, Edit3, Loader2, Check, AlertCircle, Lock, Moon, Trash2, Camera
} from 'lucide-react';

// --- MOCK DATA TYPES ---
interface UserPersonal {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  avatarUrl?: string;
}

interface UserProfessional {
  jobTitle: string;
  company: string;
  industry: string;
  bio: string;
}

interface LinkedInConnection {
  connected: boolean;
  name?: string;
  avatarUrl?: string;
  connectedAt?: string;
}

// --- INITIAL STATE ---
const INITIAL_PERSONAL: UserPersonal = {
  fullName: 'Alexandre Souza',
  email: 'alexandre@flui.ai',
  phone: '+55 11 99999-8888',
  location: 'São Paulo, Brasil',
  avatarUrl: ''
};

const INITIAL_PROFESSIONAL: UserProfessional = {
  jobTitle: 'Product Manager',
  company: 'Flui Systems',
  industry: 'Tecnologia',
  bio: 'Estrategista de produto focado em SaaS e automação de processos criativos.'
};

const INDUSTRIES = ['Marketing', 'Tecnologia', 'Educação', 'Negócios', 'Saúde', 'Outro'];

export const Profile: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [personal, setPersonal] = useState<UserPersonal>(INITIAL_PERSONAL);
  const [professional, setProfessional] = useState<UserProfessional>(INITIAL_PROFESSIONAL);
  const [linkedin, setLinkedin] = useState<LinkedInConnection>({ connected: false });
  
  // Modals
  const [isPersonalModalOpen, setIsPersonalModalOpen] = useState(false);
  const [isProfessionalModalOpen, setIsProfessionalModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Forms
  const [personalForm, setPersonalForm] = useState<UserPersonal>(INITIAL_PERSONAL);
  const [professionalForm, setProfessionalForm] = useState<UserProfessional>(INITIAL_PROFESSIONAL);
  const [isSaving, setIsSaving] = useState(false);
  const [linkedinLoading, setLinkedinLoading] = useState(false);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- EFFECTS ---
  useEffect(() => {
    // Simulate data fetch
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, []);

  // --- HANDLERS ---

  const handleSavePersonal = () => {
    setIsSaving(true);
    setTimeout(() => {
      setPersonal(personalForm);
      setIsSaving(false);
      setIsPersonalModalOpen(false);
      console.log('Saved personal info to users table');
    }, 1000);
  };

  const handleSaveProfessional = () => {
    setIsSaving(true);
    setTimeout(() => {
      setProfessional(professionalForm);
      setIsSaving(false);
      setIsProfessionalModalOpen(false);
      console.log('Saved professional info to user_profile table');
    }, 1000);
  };

  const handleLinkedInAction = () => {
    setLinkedinLoading(true);
    setTimeout(() => {
      if (linkedin.connected) {
        // Disconnect
        setLinkedin({ connected: false });
      } else {
        // Connect
        setLinkedin({ 
          connected: true, 
          name: 'Alexandre Souza', 
          connectedAt: new Date().toLocaleDateString(),
          avatarUrl: '' // Mock
        });
      }
      setLinkedinLoading(false);
    }, 1500);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPersonalForm(prev => ({ ...prev, avatarUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-8 py-8 space-y-6">
        <Skeleton className="h-10 w-48 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-8 py-8 animate-fade-in pb-20">
      
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900">Meu Perfil</h1>
        <p className="text-gray-500 mt-1">Gerencie suas informações pessoais e conexões.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* BLOCK 1: PERSONAL INFO */}
        <Card className="h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <User className="h-5 w-5 text-gray-400" /> Informações Pessoais
            </h3>
            <Button variant="ghost" size="sm" onClick={() => {
              setPersonalForm(personal);
              setIsPersonalModalOpen(true);
            }}>
              <Edit3 className="h-4 w-4 mr-2" /> Editar
            </Button>
          </div>

          <div className="flex flex-col items-center mb-6">
            <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center text-gray-300 mb-4 overflow-hidden border border-gray-200">
              {personal.avatarUrl ? (
                <img src={personal.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <User className="h-10 w-10" />
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-900">{personal.fullName}</h2>
            <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
              <MapPin className="h-3 w-3" /> {personal.location}
            </div>
          </div>

          <div className="space-y-3 mt-auto">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100" title={linkedin.connected ? "Gerenciado pelo LinkedIn" : "Editável no menu"}>
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">{personal.email}</span>
              {linkedin.connected && <Lock className="h-3 w-3 text-gray-300 ml-auto" />}
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <Phone className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">{personal.phone || 'Telefone não informado'}</span>
            </div>
          </div>
        </Card>

        {/* BLOCK 2: PROFESSIONAL INFO */}
        <Card className="h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-gray-400" /> Profissional
            </h3>
            <Button variant="ghost" size="sm" onClick={() => {
              setProfessionalForm(professional);
              setIsProfessionalModalOpen(true);
            }}>
              <Edit3 className="h-4 w-4 mr-2" /> Editar
            </Button>
          </div>

          <div className="space-y-6 flex-1">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Cargo</span>
                <p className="font-medium text-gray-900">{professional.jobTitle}</p>
              </div>
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Empresa</span>
                <p className="font-medium text-gray-900">{professional.company}</p>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Área de Atuação</span>
              <Badge variant="secondary" className="mt-1">{professional.industry}</Badge>
            </div>

            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Bio Curta</span>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-sm text-gray-600 italic">
                "{professional.bio}"
              </div>
            </div>
          </div>
        </Card>

        {/* BLOCK 3: LINKEDIN */}
        <Card className="flex flex-col justify-between">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${linkedin.connected ? 'bg-[#0077b5] text-white' : 'bg-gray-100 text-gray-400'}`}>
                <Linkedin className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">LinkedIn</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {linkedin.connected ? 'Conectado para publicações.' : 'Conecte para publicar automaticamente.'}
                </p>
              </div>
            </div>
            {linkedin.connected && (
              <Badge variant="success" className="bg-emerald-50 text-emerald-700 border-emerald-100">Ativo</Badge>
            )}
          </div>

          {linkedin.connected ? (
            <div className="mt-4 p-4 bg-blue-50/50 border border-blue-100 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-[#0077b5] rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {linkedin.name?.substring(0,2).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{linkedin.name}</p>
                  <p className="text-xs text-gray-500">Desde {linkedin.connectedAt}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLinkedInAction} disabled={linkedinLoading} className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 text-xs">
                {linkedinLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Desconectar'}
              </Button>
            </div>
          ) : (
            <div className="mt-4">
              <Button 
                className="w-full bg-[#0077b5] hover:bg-[#006097] text-white border-0" 
                onClick={handleLinkedInAction}
                loading={linkedinLoading}
              >
                Conectar com LinkedIn
              </Button>
            </div>
          )}
        </Card>

        {/* BLOCK 4: ACCOUNT */}
        <Card className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-bold text-gray-900">Configurações da Conta</h3>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div>
              <span className="text-sm font-medium text-gray-900">Plano Atual</span>
              <p className="text-xs text-gray-500">Renova em 20/10/2024</p>
            </div>
            <Badge variant="energy">PRO</Badge>
          </div>

          <div className="space-y-3 pt-2">
            <Button variant="outline" className="w-full justify-start text-gray-600">
              <Lock className="h-4 w-4 mr-2" /> Alterar Senha
            </Button>
            
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
               <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Moon className="h-4 w-4" /> Dark Mode
               </div>
               <div className="w-10 h-5 bg-gray-200 rounded-full relative cursor-pointer">
                  <div className="absolute left-1 top-1 h-3 w-3 bg-white rounded-full shadow-sm transition-all"></div>
               </div>
            </div>

            <Button 
              variant="ghost" 
              className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" /> Excluir Conta
            </Button>
          </div>
        </Card>

      </div>

      {/* --- MODALS --- */}

      {/* 1. PERSONAL INFO MODAL */}
      <Modal
        isOpen={isPersonalModalOpen}
        onClose={() => !isSaving && setIsPersonalModalOpen(false)}
        title="Editar Informações Pessoais"
      >
        <div className="space-y-6 mt-2">
          
          {/* Avatar Upload Section */}
          <div className="flex flex-col items-center">
             <div 
               className="group relative h-28 w-28 rounded-full bg-gray-100 border-2 border-gray-200 mb-3 overflow-hidden cursor-pointer"
               onClick={() => fileInputRef.current?.click()}
             >
                {personalForm.avatarUrl ? (
                  <img src={personalForm.avatarUrl} alt="Avatar" className="h-full w-full object-cover transition-opacity group-hover:opacity-75" />
                ) : (
                  <User className="h-12 w-12 text-gray-300 absolute inset-0 m-auto" />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                   <Camera className="h-8 w-8 text-white" />
                </div>
             </div>
             <Button variant="outline" size="sm" className="text-xs" onClick={() => fileInputRef.current?.click()}>
               Alterar Foto
             </Button>
             <input 
               type="file" 
               ref={fileInputRef} 
               className="hidden" 
               accept="image/*" 
               onChange={handleAvatarChange} 
             />
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Nome Completo</label>
              <Input 
                value={personalForm.fullName} 
                onChange={(e) => setPersonalForm({...personalForm, fullName: e.target.value})} 
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
              <div className="relative">
                <Input 
                  value={personalForm.email} 
                  onChange={(e) => setPersonalForm({...personalForm, email: e.target.value})}
                  disabled={linkedin.connected}
                  className={linkedin.connected ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}
                />
                {linkedin.connected && (
                   <Lock className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                )}
              </div>
              {linkedin.connected && (
                <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                   <AlertCircle className="h-3 w-3" /> Gerenciado pelo login do LinkedIn
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Telefone</label>
              <Input 
                value={personalForm.phone} 
                onChange={(e) => setPersonalForm({...personalForm, phone: e.target.value})} 
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Localização</label>
              <Input 
                value={personalForm.location} 
                onChange={(e) => setPersonalForm({...personalForm, location: e.target.value})} 
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
            <Button variant="ghost" onClick={() => setIsPersonalModalOpen(false)} disabled={isSaving}>Cancelar</Button>
            <Button variant="trust" onClick={handleSavePersonal} loading={isSaving}>Salvar Alterações</Button>
          </div>
        </div>
      </Modal>

      {/* 2. PROFESSIONAL INFO MODAL */}
      <Modal
        isOpen={isProfessionalModalOpen}
        onClose={() => !isSaving && setIsProfessionalModalOpen(false)}
        title="Editar Informações Profissionais"
      >
        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Cargo</label>
              <Input 
                value={professionalForm.jobTitle} 
                onChange={(e) => setProfessionalForm({...professionalForm, jobTitle: e.target.value})} 
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Empresa</label>
              <Input 
                value={professionalForm.company} 
                onChange={(e) => setProfessionalForm({...professionalForm, company: e.target.value})} 
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Área de Atuação</label>
            <div className="flex flex-wrap gap-2">
              {INDUSTRIES.map(ind => (
                <button
                  key={ind}
                  onClick={() => setProfessionalForm({...professionalForm, industry: ind})}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-all ${
                    professionalForm.industry === ind
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {ind}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Bio Curta (Max 280 caracteres)</label>
            <TextArea 
              value={professionalForm.bio} 
              onChange={(e) => setProfessionalForm({...professionalForm, bio: e.target.value})}
              maxLength={280}
              className="h-24"
            />
            <p className="text-xs text-gray-400 text-right mt-1">{professionalForm.bio.length}/280</p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="ghost" onClick={() => setIsProfessionalModalOpen(false)} disabled={isSaving}>Cancelar</Button>
            <Button variant="trust" onClick={handleSaveProfessional} loading={isSaving}>Salvar Alterações</Button>
          </div>
        </div>
      </Modal>

      {/* 3. DELETE ACCOUNT MODAL */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Excluir Conta Permanentemente"
      >
        <div className="mt-4 space-y-4">
          <div className="bg-red-50 border border-red-100 p-4 rounded-lg flex gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
            <p className="text-sm text-red-800">
              Esta ação não pode ser desfeita. Todos os seus dados, estratégias e conteúdos serão apagados permanentemente.
            </p>
          </div>
          <p className="text-sm text-gray-600">
            Digite <strong>DELETAR</strong> abaixo para confirmar.
          </p>
          <Input placeholder="" />
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>Cancelar</Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white border-0">Excluir Conta</Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};
