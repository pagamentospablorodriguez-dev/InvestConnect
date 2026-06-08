import { motion } from 'framer-motion';
import { X, Check, Star, Zap, Shield, TrendingUp } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  if (!isOpen) return null;

  const features = [
    { name: 'Prioridade em lances', icon: Zap, free: false, pro: true },
    { name: 'Badge de verificado', icon: Check, free: true, pro: true },
    { name: 'Relatórios detalhados', icon: TrendingUp, free: false, pro: true },
    { name: 'Suporte prioritário', icon: Shield, free: false, pro: true },
    { name: 'Limite de projetos', icon: Star, free: '3', pro: 'Ilimitado' },
    { name: 'Análise de mercado', icon: TrendingUp, free: false, pro: true },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Upgrade para PRO</h2>
            <p className="text-gray-500">Desbloqueie recursos avançados e aumente suas chances de sucesso</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Free Plan */}
          <div className="border-2 border-gray-200 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Plano Básico</h3>
            <p className="text-gray-500 text-sm mb-4">Para quem está começando</p>
            <p className="text-3xl font-extrabold text-gray-900 mb-6">
              Grátis
            </p>
            <button className="w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors mb-6">
              Você está aqui
            </button>
            <div className="space-y-3">
              {features.map((feature) => (
                <div key={feature.name} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded flex items-center justify-center ${
                    feature.free ? 'bg-emerald-100' : 'bg-gray-100'
                  }`}>
                    {feature.free && <Check className="w-3 h-3 text-emerald-600" />}
                    {!feature.free && <X className="w-3 h-3 text-gray-400" />}
                  </div>
                  <span className="text-sm text-gray-600">
                    {feature.name}
                    {typeof feature.free === 'string' && ` (${feature.free})`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pro Plan */}
          <div className="border-2 border-primary-600 rounded-2xl p-6 bg-primary-50 relative">
            <div className="absolute top-0 right-0 bg-primary-600 text-white px-4 py-1 rounded-bl-xl text-sm font-semibold">
              Mais Popular
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Plano PRO</h3>
            <p className="text-gray-600 text-sm mb-4">Para maximizar resultados</p>
            <div className="mb-6">
              <p className="text-4xl font-extrabold text-gray-900">
                R$ 29
              </p>
              <p className="text-gray-500 text-sm">por mês</p>
            </div>
            <button className="w-full py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors mb-6 flex items-center justify-center gap-2">
              <Star className="w-4 h-4" />
              Assinar Agora
            </button>
            <div className="space-y-3">
              {features.map((feature) => (
                <div key={feature.name} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded flex items-center justify-center ${
                    feature.pro ? 'bg-emerald-100' : 'bg-gray-100'
                  }`}>
                    {feature.pro && <Check className="w-3 h-3 text-emerald-600" />}
                    {!feature.pro && <X className="w-3 h-3 text-gray-400" />}
                  </div>
                  <span className="text-sm text-gray-600">
                    {feature.name}
                    {typeof feature.pro === 'string' && ` (${feature.pro})`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-gradient-to-r from-primary-50 to-emerald-50 rounded-2xl p-6 mb-8">
          <h4 className="font-bold text-gray-900 mb-4">Benefícios Adicionais</h4>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">Prioridade Máxima</p>
                <p className="text-xs text-gray-500">Seus lances aparecem primeiro</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">Analytics Pro</p>
                <p className="text-xs text-gray-500">Dados detalhados de performance</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-sky-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">Suporte 24/7</p>
                <p className="text-xs text-gray-500">Tim dedicado para ajudar</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
          >
            Talvez depois
          </button>
          <button
            onClick={() => {
              // TODO: Redirecionar para checkout do Stripe
              window.location.href = 'https://checkout.stripe.com/pro';
            }}
            className="flex-1 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
          >
            <Star className="w-4 h-4" />
            Assinar PRO Agora
          </button>
        </div>
      </motion.div>
    </div>
  );
}
