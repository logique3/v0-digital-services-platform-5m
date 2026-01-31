# Configuration Supabase - Guide Complet

## Étapes de Configuration

### 1. Obtenir vos Credentials Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Connectez-vous ou créez un compte
3. Créez un nouveau projet ou ouvrez un existant
4. Allez à **Settings** → **API** pour trouver:
   - `Project URL` → Cela sera votre `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → Cela sera votre `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. Variables d'Environnement Requises

Vous avez besoin de configurer ces deux variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Comment Ajouter les Variables

#### Option 1: Dans v0 (Recommandé)
1. Ouvrez le sidebar gauche
2. Cliquez sur **"Vars"**
3. Ajoutez les deux variables avec leurs valeurs
4. Sauvegardez

#### Option 2: Dans Vercel (Après déploiement)
1. Allez à votre projet Vercel
2. Settings → Environment Variables
3. Ajoutez les deux variables
4. Redéployez

#### Option 3: Fichier .env.local (Local Development)
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Vérifier la Configuration

L'application va automatiquement:
- Détecter si Supabase est configuré
- Utiliser localStorage en fallback si non configuré
- Logger les informations de configuration dans la console

Ouvrez la console (F12) et recherchez `[v0] Supabase is configured and ready` ou `[v0] Supabase not configured`

## Architecture de Synchronisation

### Fonctionnement du Panier

1. **Stockage Local** (localStorage)
   - Persistent automatiquement
   - Fonctionne toujours (même sans Supabase)
   - Synchronisé entre les onglets

2. **Synchronisation Supabase** (Si configuré)
   - À la validation du panier
   - Crée une commande dans la base de données
   - Sauvegarde les détails de chaque article
   - Logs disponibles dans la console

### Flow de Commande

```
Client ajoute article → localStorage
Client checkout → 
  ├─ Si Supabase OK → Créer dans DB
  ├─ Si Supabase indisponible → Continuer quand même
  └─ Ouvrir WhatsApp → Envoyer détails manuellement
```

## Tables Supabase Requises

Ces tables doivent exister dans votre projet Supabase:

### services
```sql
- id (uuid)
- name (text)
- description (text)
- price (decimal)
- category (text)
- image_url (text)
- rating (float)
- reviews_count (integer)
- created_at (timestamp)
- updated_at (timestamp)
```

### orders
```sql
- id (uuid)
- user_id (uuid)
- total_amount (decimal)
- status (text)
- payment_method (text)
- created_at (timestamp)
- updated_at (timestamp)
```

### order_items
```sql
- id (uuid)
- order_id (uuid)
- service_id (uuid)
- quantity (integer)
- unit_price (decimal)
- created_at (timestamp)
```

## Troubleshooting

### "Supabase not configured" dans la console
**Solution**: Vérifiez que vous avez ajouté les variables d'environnement

### Les commandes ne se sauvegardent pas
**Solution**: 
1. Vérifiez que les variables sont correctes
2. Assurez-vous que les tables existent dans Supabase
3. Consultez les logs dans la console (F12)

### Les variables ne se chargent pas
**Solution**:
1. Les variables doivent commencer par `NEXT_PUBLIC_` pour être accessibles côté client
2. Redémarrez le serveur après ajouter les variables
3. Vérifiez qu'il n'y a pas d'espaces supplémentaires

## Logs de Débogage

L'application génère des logs détaillés prefixés avec `[v0]`:

```javascript
// Console output examples:
[v0] Initializing cart hook...
[v0] Cart loaded from localStorage
[v0] Supabase is configured and ready
[v0] Submitting order to Supabase...
[v0] Order created: 123e4567-e89b-12d3-a456-426614174000
[v0] Order items created successfully
```

## Fonctionnalités de Synchronisation

### Si Supabase est Configuré
- ✅ Les commandes sont sauvegardées dans la DB
- ✅ Historique des commandes disponible
- ✅ Meilleure sécurité et intégrité des données
- ✅ Scalabilité améliorée

### Si Supabase n'est Pas Configuré
- ✅ Les commandes restent dans localStorage
- ✅ WhatsApp reste fonctionnel
- ✅ Pas d'interruption du service
- ⚠️ Données perdues si cache vidé

## Prochaines Étapes

1. ✅ Configurez les variables Supabase
2. ✅ Testez avec la page `/test`
3. ✅ Consultez les logs pour confirmer la connexion
4. ✅ Lancez votre plateforme!

---

**Besoin d'aide?** Consultez la console avec F12 pour voir les logs détaillés.
