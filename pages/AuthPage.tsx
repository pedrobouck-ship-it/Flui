
import React, { useState, useEffect } from 'react';
import { Button, Card, Input, Label, Checkbox, Tabs, TabsContent, TabsList, TabsTrigger } from '../components/UI';
import { Linkedin, MailCheck, ArrowRight, User, AlertCircle, Sparkles, LogOut, Loader2 } from 'lucide-react';
import { Logo } from '../components/Logo';

interface AuthPageProps {
  onLogin: () => void;
}

type AuthState = 'LOGIN' | 'REGISTER' | 'RECOVER' | 'RETURNING';

interface StoredUser {
  name: string;
  email: string;
  avatarUrl?: string;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [view, setView] = useState<AuthState>('LOGIN');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Forms
  const [loginForm, setLoginForm] = useState({ email: '', password: '', remember: false });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [recoverEmail, setRecoverEmail] = useState('');
  
  // Returning User Data
  const [storedUser, setStoredUser] = useState<StoredUser | null>(null);

  // Dynamic Title State
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  const phrases = [
    "autoridade sistemática.",
    "receita previsível.",
    "processos escaláveis.",
    "ativos de valor."
  ];

  // Typing Effect Logic
  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % phrases.length;
      const fullText = phrases[i];

      setDisplayedText(isDeleting 
        ? fullText.substring(0, displayedText.length - 1) 
        : fullText.substring(0, displayedText.length + 1)
      );

      setTypingSpeed(isDeleting ? 40 : 100);

      if (!isDeleting && displayedText === fullText) {
        setTimeout(() => setIsDeleting(true), 2000); // Pause at end
      } else if (isDeleting && displayedText === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, loopNum, typingSpeed]);

  // Check Local Storage on Mount
  useEffect(() => {
    const userJson = localStorage.getItem('flui_last_user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        setStoredUser(user);
        setView('RETURNING');
      } catch (e) {
        console.error("Failed to parse stored user", e);
        localStorage.removeItem('flui_last_user');
      }
    }
  }, []);

  // --- VALIDATORS ---
  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
  const validatePassword = (pass: string) => pass.length >= 8;

  // --- HANDLERS ---

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateEmail(loginForm.email) || !loginForm.password) {
      setError("Por favor, preencha todos os campos corretamente.");
      return;
    }

    setIsLoading(true);
    
    // Simulate Backend Check
    setTimeout(() => {
      setIsLoading(false);
      
      // Save for "Returning User" mode if Remember Me is checked
      if (loginForm.remember) {
        const userData: StoredUser = { 
          name: 'Usuário Demo', 
          email: loginForm.email,
          avatarUrl: '' 
        };
        localStorage.setItem('flui_last_user', JSON.stringify(userData));
      } else {
        localStorage.removeItem('flui_last_user');
      }

      onLogin();
    }, 1500);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!registerForm.name || !validateEmail(registerForm.email)) {
      setError("Verifique o nome e o email.");
      return;
    }
    if (!validatePassword(registerForm.password)) {
      setError("A senha deve ter no mínimo 8 caracteres.");
      return;
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validateEmail(recoverEmail)) {
      setError("Insira um email válido.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Change UI to success state locally within view, or simple alert for now
      alert(`Link de recuperação enviado para ${recoverEmail}`);
      setView('LOGIN');
    }, 1000);
  };

  const handleReturningLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1000);
  };

  const handleLinkedInAuth = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Simulate success
      onLogin();
    }, 1200);
  };

  // --- RENDERERS ---

  return (
    <div className="flex min-h-screen w-full bg-white font-sans text-brand-dark overflow-hidden">
      
      {/* 1. LEFT SIDE - VISUAL (Desktop Only) */}
      <div className="hidden lg:flex w-1/2 bg-slate-950 relative overflow-hidden flex-col justify-between p-12">
        {/* Animated Background Elements - Darkened for better text contrast */}
        <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
           <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-trust-primary/10 rounded-full blur-[120px] animate-pulse"></div>
           <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-energy-primary/5 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '1s' }}></div>
           <div className="absolute top-[40%] left-[20%] w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px]"></div>
        </div>

        {/* Brand Content */}
        <div className="relative z-10">
           <Logo className="h-8 w-auto text-white" />
        </div>

        <div className="relative z-10 max-w-xl">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-white text-xs font-bold tracking-wide uppercase mb-8 backdrop-blur-md shadow-sm">
              <Sparkles className="h-3 w-3 text-energy-accent" />
              SaaS Intelligence
           </div>
           
           <h1 className="text-5xl font-serif font-bold text-white mb-6 leading-[1.15] drop-shadow-sm">
              Transforme caos em <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 inline-block min-h-[1.2em]">
                {displayedText}
                <span className="animate-pulse text-white ml-1">|</span>
              </span>
           </h1>
           
           <p className="text-lg text-slate-300 leading-relaxed font-medium drop-shadow-md max-w-md">
              Junte-se a estrategistas que usam IA para definir arquétipos, construir narrativas e escalar conteúdo sem perder a essência.
           </p>
        </div>

        <div className="relative z-10 text-xs text-slate-500 font-medium">
           © 2024 Flui Systems Inc.
        </div>
      </div>

      {/* 2. RIGHT SIDE - AUTH FORM */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 bg-gray-50/50">
        
        {/* Mobile Header Banner */}
        <div className="lg:hidden mb-8 text-center">
           <Logo className="h-8 w-auto text-brand-dark mx-auto mb-4" />
           <h2 className="text-xl font-bold text-gray-900">Bem-vindo ao Flui</h2>
        </div>

        <Card className="w-full max-w-[440px] shadow-xl border-gray-100 bg-white" context="none">
           
           {/* RETURNING USER VIEW */}
           {view === 'RETURNING' && storedUser && (
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="text-center mb-8">
                   <div className="relative inline-block mb-4">
                      <div className="h-20 w-20 rounded-full bg-gradient-to-br from-trust-primary to-energy-primary p-[2px]">
                         <div className="h-full w-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                            {storedUser.avatarUrl ? (
                               <img src={storedUser.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                            ) : (
                               <User className="h-10 w-10 text-gray-300" />
                            )}
                         </div>
                      </div>
                      <div className="absolute bottom-0 right-0 h-5 w-5 bg-green-500 border-2 border-white rounded-full"></div>
                   </div>
                   <h2 className="text-xl font-bold text-gray-900">Bem-vindo de volta, {storedUser.name.split(' ')[0]}!</h2>
                   <p className="text-sm text-gray-500 mt-1">{storedUser.email.replace(/(.{2})(.*)(@.*)/, "$1***$3")}</p>
                </div>

                <form onSubmit={handleReturningLogin} className="space-y-6">
                   <div className="space-y-2">
                      <Label>Senha</Label>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        autoFocus
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                      />
                   </div>
                   
                   <div className="space-y-3">
                      <Button variant="trust" className="w-full h-11 text-base shadow-lg hover:shadow-xl transition-all" loading={isLoading}>
                         Entrar na conta
                      </Button>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        className="w-full text-gray-500 hover:text-red-500 hover:bg-red-50"
                        onClick={() => {
                           localStorage.removeItem('flui_last_user');
                           setStoredUser(null);
                           setView('LOGIN');
                        }}
                      >
                         <LogOut className="h-4 w-4 mr-2" /> Usar outra conta
                      </Button>
                   </div>
                </form>
             </div>
           )}

           {/* LOGIN / REGISTER VIEW */}
           {(view === 'LOGIN' || view === 'REGISTER') && (
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="text-center mb-8 hidden lg:block">
                   <h2 className="text-2xl font-bold text-gray-900">Acesse sua conta</h2>
                   <p className="text-sm text-gray-500 mt-2">Gerencie sua estratégia de conteúdo.</p>
                </div>

                <Tabs value={view} onValueChange={(v) => setView(v as AuthState)} className="w-full mb-6">
                   <TabsList className="grid w-full grid-cols-2 p-1 bg-gray-100 rounded-xl">
                      <TabsTrigger value="LOGIN" className="rounded-lg text-sm font-medium">Entrar</TabsTrigger>
                      <TabsTrigger value="REGISTER" className="rounded-lg text-sm font-medium">Criar Conta</TabsTrigger>
                   </TabsList>
                </Tabs>

                {error && (
                   <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3 text-sm text-red-700 animate-in slide-in-from-top-2">
                      <AlertCircle className="h-5 w-5 shrink-0" />
                      {error}
                   </div>
                )}

                {view === 'LOGIN' ? (
                   <form onSubmit={handleLogin} className="space-y-5">
                      <div className="space-y-2">
                         <Label htmlFor="email">Email Corporativo</Label>
                         <Input 
                           id="email" 
                           type="email" 
                           placeholder="nome@empresa.com" 
                           value={loginForm.email}
                           onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                         />
                      </div>
                      <div className="space-y-2">
                         <div className="flex items-center justify-between">
                            <Label htmlFor="password">Senha</Label>
                            <button 
                              type="button" 
                              onClick={() => setView('RECOVER')}
                              className="text-xs text-trust-primary hover:text-trust-hover font-medium"
                            >
                               Esqueci a senha
                            </button>
                         </div>
                         <Input 
                           id="password" 
                           type="password" 
                           placeholder="••••••••" 
                           value={loginForm.password}
                           onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                         />
                      </div>
                      
                      <div className="flex items-center gap-2">
                         <Checkbox 
                           id="remember"
                           checked={loginForm.remember}
                           onChange={(e) => setLoginForm({...loginForm, remember: e.target.checked})}
                         />
                         <label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer select-none">Lembrar de mim por 30 dias</label>
                      </div>

                      <div className="space-y-3 pt-2">
                         <Button variant="trust" className="w-full h-11 font-bold shadow-md hover:shadow-lg transition-all" loading={isLoading}>
                            Entrar
                         </Button>
                         
                         <div className="relative flex py-2 items-center">
                            <div className="flex-grow border-t border-gray-200"></div>
                            <span className="flex-shrink-0 mx-4 text-gray-400 text-xs uppercase tracking-wide">Ou</span>
                            <div className="flex-grow border-t border-gray-200"></div>
                         </div>

                         <Button 
                           type="button" 
                           variant="outline" 
                           className="w-full h-11 text-gray-700 font-medium hover:bg-gray-50 border-gray-300"
                           onClick={handleLinkedInAuth}
                           disabled={isLoading}
                         >
                            <Linkedin className="h-5 w-5 mr-2 text-[#0077b5]" />
                            Continuar com LinkedIn
                         </Button>
                      </div>
                   </form>
                ) : (
                   <form onSubmit={handleRegister} className="space-y-5">
                      <div className="space-y-2">
                         <Label htmlFor="name">Nome Completo</Label>
                         <Input 
                           id="name" 
                           placeholder="Ex: Ana Silva" 
                           value={registerForm.name}
                           onChange={(e) => setRegisterForm({...registerForm, name: e.target.value})}
                         />
                      </div>
                      <div className="space-y-2">
                         <Label htmlFor="reg-email">Email</Label>
                         <Input 
                           id="reg-email" 
                           type="email" 
                           placeholder="nome@empresa.com" 
                           value={registerForm.email}
                           onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                         />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <Label htmlFor="reg-pass">Senha</Label>
                            <Input 
                              id="reg-pass" 
                              type="password" 
                              placeholder="Min 8 chars" 
                              value={registerForm.password}
                              onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                            />
                         </div>
                         <div className="space-y-2">
                            <Label htmlFor="reg-confirm">Confirmar</Label>
                            <Input 
                              id="reg-confirm" 
                              type="password" 
                              placeholder="Repita a senha" 
                              value={registerForm.confirmPassword}
                              onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                            />
                         </div>
                      </div>

                      <div className="space-y-3 pt-4">
                         <Button variant="energy" className="w-full h-11 font-bold shadow-md hover:shadow-lg transition-all" loading={isLoading}>
                            Criar Conta Gratuita
                         </Button>
                         <Button 
                           type="button" 
                           variant="outline" 
                           className="w-full h-11 text-gray-700"
                           onClick={handleLinkedInAuth}
                           disabled={isLoading}
                         >
                            <Linkedin className="h-5 w-5 mr-2 text-[#0077b5]" />
                            Cadastrar com LinkedIn
                         </Button>
                      </div>
                   </form>
                )}
             </div>
           )}

           {/* RECOVER PASSWORD VIEW */}
           {view === 'RECOVER' && (
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 text-center">
                <div className="h-12 w-12 bg-indigo-50 text-trust-primary rounded-full flex items-center justify-center mx-auto mb-6">
                   <MailCheck className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Recuperar Senha</h2>
                <p className="text-sm text-gray-500 mb-8 max-w-xs mx-auto">
                   Digite o email cadastrado e enviaremos um link seguro para você redefinir sua senha.
                </p>

                {error && (
                   <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3 text-sm text-red-700 text-left">
                      <AlertCircle className="h-5 w-5 shrink-0" />
                      {error}
                   </div>
                )}

                <form onSubmit={handleRecover} className="space-y-6 text-left">
                   <div className="space-y-2">
                      <Label>Seu Email</Label>
                      <Input 
                        type="email" 
                        placeholder="nome@empresa.com"
                        value={recoverEmail}
                        onChange={(e) => setRecoverEmail(e.target.value)}
                      />
                   </div>
                   <Button variant="trust" className="w-full h-11" loading={isLoading}>
                      Enviar Link de Redefinição
                   </Button>
                </form>

                <button 
                  onClick={() => setView('LOGIN')}
                  className="mt-6 text-sm text-gray-500 hover:text-gray-900 font-medium flex items-center justify-center gap-2 mx-auto"
                >
                   <ArrowRight className="h-4 w-4 rotate-180" /> Voltar para Login
                </button>
             </div>
           )}

        </Card>

        {/* Footer Links (Right Side) */}
        <div className="mt-8 flex gap-6 text-xs text-gray-400 font-medium">
           <a href="#" className="hover:text-gray-600">Termos de Uso</a>
           <a href="#" className="hover:text-gray-600">Privacidade</a>
           <a href="#" className="hover:text-gray-600">Ajuda</a>
        </div>

      </div>
    </div>
  );
};
