
import React from 'react';
import { Blueprint, BlueprintStatus } from '../types';
import { Button, Card, Badge, Separator, Progress } from '../components/UI';
import { ArrowLeft, Calendar, Zap, Target, Layers, PlayCircle, Archive, RotateCcw, LayoutGrid, FileText } from 'lucide-react';

interface BlueprintDetailProps {
  blueprint: Blueprint;
  onBack: () => void;
}

export const BlueprintDetail: React.FC<BlueprintDetailProps> = ({ blueprint, onBack }) => {
  if (!blueprint) return <div>Blueprint not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-8 py-8 animate-fade-in">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8 -ml-2">
               <ArrowLeft className="h-5 w-5" />
             </Button>
             <h1 className="text-3xl font-serif font-bold text-gray-900">{blueprint.name}</h1>
             <Badge variant={blueprint.status === BlueprintStatus.ACTIVE ? 'trust' : 'secondary'}>
                {blueprint.status}
             </Badge>
          </div>
          <p className="text-gray-500 flex items-center gap-2">
            <Target className="h-4 w-4" />
            Objetivo Primário: <span className="font-medium text-gray-900">{blueprint.objective}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="text-gray-600">
            <Archive className="h-4 w-4 mr-2" />
            Arquivar
          </Button>
          <Button variant="outline" className="text-gray-600">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reprocessar
          </Button>
          <Button variant="energy">
            <PlayCircle className="h-4 w-4 mr-2" />
            Criar Session
          </Button>
        </div>
      </div>

      {/* OVERVIEW SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Metric 1 */}
        <Card className="flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-4 text-gray-500 uppercase text-xs font-bold tracking-wider">
            <Zap className="h-4 w-4" /> Intensidade & Foco
          </div>
          <div>
             <div className="flex justify-between items-end mb-2">
                <span className="text-3xl font-serif font-bold text-gray-900">{blueprint.intensity}%</span>
                <span className="text-sm font-medium text-gray-500 mb-1">Carga de Produção</span>
             </div>
             <Progress value={blueprint.intensity} indicatorColor="bg-energy-primary" />
          </div>
        </Card>

        {/* Metric 2 */}
        <Card className="flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-4 text-gray-500 uppercase text-xs font-bold tracking-wider">
            <Layers className="h-4 w-4" /> Pilares Ativos
          </div>
          <div className="flex flex-wrap gap-2">
            {blueprint.pillars.map((p, i) => (
              <Badge key={i} variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                {p}
              </Badge>
            ))}
          </div>
        </Card>

        {/* Metric 3 */}
        <Card className="flex flex-col justify-between">
           <div className="flex items-center gap-2 mb-4 text-gray-500 uppercase text-xs font-bold tracking-wider">
            <Calendar className="h-4 w-4" /> Duração do Ciclo
          </div>
          <div>
            <span className="text-3xl font-serif font-bold text-gray-900">{blueprint.duration}</span>
            <p className="text-sm text-gray-500 mt-1">Ciclo tático vigente</p>
          </div>
        </Card>
      </div>

      <Separator className="mb-12" />

      {/* MACRO STRUCTURE SECTION */}
      <div>
        <div className="flex items-center justify-between mb-8">
           <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
             <LayoutGrid className="h-6 w-6 text-trust-primary" />
             Arquitetura de Temas
           </h2>
           <span className="text-sm text-gray-500">
             {blueprint.themes.length} temas principais • {blueprint.themes.reduce((acc, t) => acc + t.series.length, 0)} séries de conteúdo
           </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {blueprint.themes.map((theme) => (
            <div key={theme.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
               {/* Theme Header */}
               <div className="p-6 bg-gray-50 border-b border-gray-100 flex justify-between items-start">
                  <div>
                    <Badge variant="outline" className="mb-2 bg-white text-gray-600 border-gray-200">
                      {theme.focus}
                    </Badge>
                    <h3 className="text-lg font-bold text-gray-900">{theme.title}</h3>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400">
                    <Layers className="h-4 w-4" />
                  </div>
               </div>

               {/* Series List */}
               <div className="p-4 space-y-3">
                  {theme.series.map((series) => (
                    <div 
                      key={series.id} 
                      className="group flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-100"
                    >
                       <div className="mt-1">
                          <FileText className="h-5 w-5 text-gray-300 group-hover:text-trust-primary transition-colors" />
                       </div>
                       <div className="flex-1">
                          <h4 className="text-sm font-semibold text-gray-900 group-hover:text-trust-primary transition-colors">
                            {series.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                            Ângulo: <span className="text-gray-700">{series.angle}</span>
                          </p>
                       </div>
                       <div className="text-right">
                          <Badge variant="secondary" className="text-[10px] px-1.5 h-5">
                            {series.format}
                          </Badge>
                          <div className="text-[10px] text-gray-400 mt-1">{series.frequency}</div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
