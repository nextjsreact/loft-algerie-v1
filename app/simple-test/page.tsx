import { UploadTestSimple } from '@/components/lofts/upload-test-simple'
import { DbStatusChecker } from '@/components/lofts/db-status-checker'
import { requireAuth } from '@/lib/auth'

export default async function SimpleTestPage() {
  // Vérifier l'authentification
  await requireAuth()

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">🔧 Test Upload Photos - Version Simple</h1>
        <p className="text-gray-600">
          Diagnostic simplifié pour résoudre les problèmes d'upload de photos des lofts.
        </p>
      </div>
      
      {/* Vérificateur de statut de la DB */}
      <DbStatusChecker />
      
      {/* Test d'upload simplifié */}
      <UploadTestSimple />
      
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
        <h2 className="font-bold mb-3 text-blue-900 flex items-center gap-2">
          🚀 Guide de Résolution Rapide
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-blue-800 mb-2">1️⃣ Vérifications Préalables</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>✅ Vérifiez l'état de la configuration ci-dessus</li>
              <li>✅ Assurez-vous que tous les indicateurs sont verts</li>
              <li>✅ Suivez les recommandations affichées</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-blue-800 mb-2">2️⃣ Tests d'Upload</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>🔗 Testez d'abord "Test APIs"</li>
              <li>📤 Puis testez "Test Upload"</li>
              <li>🔍 Consultez la console (F12) pour les détails</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-white rounded border border-blue-300">
          <p className="text-sm text-blue-800">
            <strong>💡 Solution la plus courante:</strong> Si la table 'loft_photos' n'existe pas, 
            exécutez la migration avec: <code className="bg-blue-100 px-2 py-1 rounded font-mono">supabase db push</code>
          </p>
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-sm text-gray-500">
          Une fois tous les tests réussis, l'upload de photos devrait fonctionner dans l'application principale.
        </p>
      </div>
    </div>
  )
}