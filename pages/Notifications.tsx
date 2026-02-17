
import React from 'react';
import { AppNotification, View } from '../types';
import { Button, Card, Badge } from '../components/UI';
import { Bell, CheckCircle2, AlertCircle, Zap, Layout } from 'lucide-react';

interface NotificationsProps {
  notifications: AppNotification[];
  onNavigate: (view: View) => void;
  onMarkAsRead: (id: string) => void;
}

export const Notifications: React.FC<NotificationsProps> = ({ notifications, onNavigate, onMarkAsRead }) => {
  
  const getIcon = (type: string) => {
    switch(type) {
      case 'STRATEGY': return <Layout className="h-5 w-5 text-trust-primary" />;
      case 'PRODUCTION': return <Zap className="h-5 w-5 text-energy-primary" />;
      case 'SYSTEM': return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case 'ACHIEVEMENT': return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      default: return <Bell className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-8 py-8 animate-fade-in">
      
      <div className="flex items-center justify-between mb-8">
        <div>
           <h1 className="text-3xl font-bold text-gray-900">Central de Notificações</h1>
           <p className="text-gray-500 mt-1">Histórico de alertas e conquistas do sistema.</p>
        </div>
        <Button variant="outline">Marcar todas como lidas</Button>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900">Tudo limpo!</h3>
            <p className="text-gray-500">Você não tem novas notificações.</p>
          </div>
        ) : (
          notifications.map(notif => (
            <Card 
              key={notif.id} 
              className={`flex gap-4 items-start transition-all ${notif.isRead ? 'opacity-75 bg-gray-50' : 'bg-white shadow-sm border-l-4 border-l-trust-primary'}`}
              onClick={() => onMarkAsRead(notif.id)}
            >
               <div className="mt-1 p-2 bg-white rounded-full border border-gray-100 shadow-sm">
                  {getIcon(notif.type)}
               </div>
               
               <div className="flex-1">
                  <div className="flex justify-between items-start">
                     <h4 className="font-bold text-gray-900 text-sm">{notif.title}</h4>
                     <span className="text-xs text-gray-400">{notif.createdAt}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 mb-3">{notif.message}</p>
                  
                  {notif.actionLabel && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs h-7"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (notif.targetView) onNavigate(notif.targetView);
                      }}
                    >
                      {notif.actionLabel}
                    </Button>
                  )}
               </div>

               {!notif.isRead && (
                 <div className="h-2 w-2 rounded-full bg-trust-primary mt-2" />
               )}
            </Card>
          ))
        )}
      </div>

    </div>
  );
};
