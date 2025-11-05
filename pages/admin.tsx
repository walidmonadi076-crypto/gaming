import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import type { Game, BlogPost, Product } from '../types';
import AdminDashboard from '../components/AdminDashboard';
import { paginate } from '../lib/pagination';

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [activeTab, setActiveTab] = useState<'games' | 'blogs' | 'products'>('games');
  const [games, setGames] = useState<Game[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
      setCurrentPage(1);
    }
  }, [activeTab, isAuthenticated]);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/check');
      const data = await res.json();
      setIsAuthenticated(data.authenticated);
    } catch (error) {
      setIsAuthenticated(false);
    }
    setCheckingAuth(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        setPassword('');
      } else {
        setLoginError(data.message || 'Mot de passe incorrect');
      }
    } catch (error) {
      setLoginError('Erreur de connexion');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout');
    setIsAuthenticated(false);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'games') {
        const res = await fetch('/api/games');
        const data = await res.json();
        setGames(data);
      } else if (activeTab === 'blogs') {
        const res = await fetch('/api/blogs');
        const data = await res.json();
        setBlogs(data);
      } else if (activeTab === 'products') {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet élément?')) return;

    try {
      const res = await fetch(`/api/admin/${activeTab}?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        alert('Élément supprimé avec succès!');
        fetchData();
      } else {
        alert('Erreur: Non autorisé');
      }
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handleSubmit = async (formData: any) => {
    try {
      const method = editingItem ? 'PUT' : 'POST';
      const res = await fetch(`/api/admin/${activeTab}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert(editingItem ? 'Élément modifié avec succès!' : 'Élément créé avec succès!');
        setShowForm(false);
        setEditingItem(null);
        fetchData();
      } else {
        alert('Erreur: Non autorisé');
      }
    } catch (error) {
      console.error('Error saving:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div>Chargement...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <Head>
          <title>Connexion Admin</title>
        </Head>
        <div className="bg-gray-800 p-8 rounded-lg max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6 text-center">Panneau d'Administration</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block mb-2">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Entrez le mot de passe admin"
                required
              />
            </div>
            {loginError && (
              <div className="bg-red-600 bg-opacity-20 border border-red-600 text-red-400 px-4 py-2 rounded">
                {loginError}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded font-semibold transition-colors"
            >
              Se connecter
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Head>
        <title>Panneau d'Administration</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Panneau d'Administration</h1>
          <div className="flex gap-4">
            <a href="/" className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded">
              Retour au Site
            </a>
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded">
              Déconnexion
            </button>
          </div>
        </div>

        <AdminDashboard games={games} blogs={blogs} products={products} />

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('games')}
            className={`px-6 py-3 rounded-lg font-semibold ${
              activeTab === 'games' ? 'bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            Jeux ({games.length})
          </button>
          <button
            onClick={() => setActiveTab('blogs')}
            className={`px-6 py-3 rounded-lg font-semibold ${
              activeTab === 'blogs' ? 'bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            Blogs ({blogs.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 rounded-lg font-semibold ${
              activeTab === 'products' ? 'bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            Produits ({products.length})
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold capitalize">{activeTab}</h2>
            <button
              onClick={() => {
                setEditingItem(null);
                setShowForm(true);
              }}
              className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded font-semibold"
            >
              + Ajouter
            </button>
          </div>

          {loading ? (
            <div className="text-center py-10">Chargement...</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left p-3">ID</th>
                      <th className="text-left p-3">{activeTab === 'products' ? 'Nom' : 'Titre'}</th>
                      <th className="text-left p-3">Catégorie</th>
                      <th className="text-left p-3">Image</th>
                      <th className="text-right p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeTab === 'games' && paginate(games, currentPage, itemsPerPage).items.map((game) => (
                    <tr key={game.id} className="border-b border-gray-700 hover:bg-gray-750">
                      <td className="p-3">{game.id}</td>
                      <td className="p-3">{game.title}</td>
                      <td className="p-3">{game.category}</td>
                      <td className="p-3"><Image src={game.imageUrl} alt={game.title} width={64} height={64} className="object-cover rounded" /></td>
                      <td className="p-3 text-right">
                        <button onClick={() => { setEditingItem(game); setShowForm(true);}} className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded mr-2">Modifier</button>
                        <button onClick={() => handleDelete(game.id)} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded">Supprimer</button>
                      </td>
                    </tr>
                  ))}
                  {activeTab === 'blogs' && paginate(blogs, currentPage, itemsPerPage).items.map((blog) => (
                    <tr key={blog.id} className="border-b border-gray-700 hover:bg-gray-750">
                      <td className="p-3">{blog.id}</td>
                      <td className="p-3">{blog.title}</td>
                      <td className="p-3">{blog.category}</td>
                      <td className="p-3"><Image src={blog.imageUrl} alt={blog.title} width={64} height={64} className="object-cover rounded" /></td>
                      <td className="p-3 text-right">
                        <button onClick={() => { setEditingItem(blog); setShowForm(true);}} className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded mr-2">Modifier</button>
                        <button onClick={() => handleDelete(blog.id)} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded">Supprimer</button>
                      </td>
                    </tr>
                  ))}
                  {activeTab === 'products' && paginate(products, currentPage, itemsPerPage).items.map((product) => (
                    <tr key={product.id} className="border-b border-gray-700 hover:bg-gray-750">
                      <td className="p-3">{product.id}</td>
                      <td className="p-3">{product.name}</td>
                      <td className="p-3">{product.category}</td>
                      <td className="p-3"><Image src={product.imageUrl} alt={product.name} width={64} height={64} className="object-cover rounded" /></td>
                      <td className="p-3 text-right">
                        <button onClick={() => { setEditingItem(product); setShowForm(true);}} className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded mr-2">Modifier</button>
                        <button onClick={() => handleDelete(product.id)} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded">Supprimer</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {(() => {
              const currentData = activeTab === 'games' ? games : activeTab === 'blogs' ? blogs : products;
              const paginationData = paginate(currentData, currentPage, itemsPerPage);
              
              if (paginationData.totalPages > 1) {
                return (
                  <div className="flex justify-center items-center gap-4 mt-6">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={!paginationData.hasPreviousPage}
                      className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
                    >
                      Précédent
                    </button>
                    <span className="text-gray-300">
                      Page {currentPage} sur {paginationData.totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(paginationData.totalPages, prev + 1))}
                      disabled={!paginationData.hasNextPage}
                      className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
                    >
                      Suivant
                    </button>
                  </div>
                );
              }
              return null;
            })()}
          </>
          )}
        </div>
      </div>

      {showForm && (
        <AdminForm
          type={activeTab}
          item={editingItem}
          onSubmit={handleSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
}

function AdminForm({ type, item, onSubmit, onClose }: any) {
  const [formData, setFormData] = useState(item || {});

  useEffect(() => {
    setFormData(item || {});
  }, [item]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmitForm = (e: any) => {
    e.preventDefault();
    const finalFormData = { ...formData };
    if (type === 'games') {
        if (typeof finalFormData.tags === 'string') {
            finalFormData.tags = finalFormData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
        }
        if (typeof finalFormData.gallery === 'string') {
            finalFormData.gallery = finalFormData.gallery.split(',').map(url => url.trim()).filter(Boolean);
        }
    }
     if (type === 'products') {
        if (typeof finalFormData.gallery === 'string') {
            finalFormData.gallery = finalFormData.gallery.split(',').map(url => url.trim()).filter(Boolean);
        }
    }
    onSubmit(finalFormData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">
          {item ? 'Modifier' : 'Ajouter'} {type === 'games' ? 'un jeu' : type === 'blogs' ? 'un blog' : 'un produit'}
        </h2>
        <form onSubmit={handleSubmitForm} className="space-y-4">
          {type === 'games' && (
            <>
              <input name="title" placeholder="Titre" value={formData.title || ''} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 rounded" required />
              <input name="imageUrl" placeholder="URL de l'image" value={formData.imageUrl || ''} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 rounded" required />
              <input name="category" placeholder="Catégorie" value={formData.category || ''} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 rounded" required />
              <textarea name="description" placeholder="Description" value={formData.description || ''} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 rounded" rows={4} required />
              <input name="tags" placeholder="Tags (comma-separated)" value={Array.isArray(formData.tags) ? formData.tags.join(', ') : formData.tags || ''} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 rounded" />
              <textarea name="gallery" placeholder="Gallery URLs (comma-separated)" value={Array.isArray(formData.gallery) ? formData.gallery.join(', ') : formData.gallery || ''} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 rounded" rows={2}/>
              <input name="downloadUrl" placeholder="URL de téléchargement" value={formData.downloadUrl || ''} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 rounded" required />
              <input name="videoUrl" placeholder="URL de la vidéo (optionnel)" value={formData.videoUrl || ''} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 rounded" />
            </>
          )}
          {type === 'blogs' && (
            <>
              <input name="title" placeholder="Titre" value={formData.title || ''} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 rounded" required />
              <textarea name="summary" placeholder="Résumé" value={formData.summary || ''} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 rounded" rows={3} required />
              <input name="imageUrl" placeholder="URL de l'image" value={formData.imageUrl || ''} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 rounded" required />
              <input name="author" placeholder="Auteur" value={formData.author || ''} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 rounded" required />
              <input name="publishDate" placeholder="Date de publication" value={formData.publishDate || ''} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 rounded" required />
              <input name="category" placeholder="Catégorie" value={formData.category || ''} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 rounded" required />
              <input name="rating" type="number" step="0.1" min="0" max="5" placeholder="Note (0-5)" value={formData.rating || ''} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 rounded" required />
              <input name="affiliateUrl" placeholder="URL d'affiliation" value={formData.affiliateUrl || ''} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 rounded" required />
              <textarea name="content" placeholder="Contenu HTML" value={formData.content || ''} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 rounded" rows={6} required />
            </>
          )}
          {type === 'products' && (
            <>
              <input name="name" placeholder="Nom" value={formData.name || ''} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 rounded" required />
              <input name="imageUrl" placeholder="URL de l'image" value={formData.imageUrl || ''} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 rounded" required />
              <input name="price" placeholder="Prix" value={formData.price || ''} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 rounded" required />
              <input name="url" placeholder="URL du produit" value={formData.url || ''} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 rounded" required />
              <input name="category" placeholder="Catégorie" value={formData.category || ''} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 rounded" required />
              <textarea name="description" placeholder="Description" value={formData.description || ''} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 rounded" rows={4} required />
              <textarea name="gallery" placeholder="Gallery URLs (comma-separated)" value={Array.isArray(formData.gallery) ? formData.gallery.join(', ') : formData.gallery || ''} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 rounded" rows={2}/>
            </>
          )}
          <div className="flex gap-4 pt-4">
            <button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 px-6 py-2 rounded font-semibold">Enregistrer</button>
            <button type="button" onClick={onClose} className="flex-1 bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded font-semibold">Annuler</button>
          </div>
        </form>
      </div>
    </div>
  );
}
