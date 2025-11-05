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
  const [searchQuery, setSearchQuery] = useState(''); // ✅ جديد: البحث

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
      setCurrentPage(1);
      setSearchQuery('');
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

  // ✅ filter dynamique avant pagination
  const currentData =
    activeTab === 'games' ? games :
    activeTab === 'blogs' ? blogs :
    products;

  const filteredData = currentData.filter((item: any) => {
    const query = searchQuery.toLowerCase();
    return (
      (item.title && item.title.toLowerCase().includes(query)) ||
      (item.name && item.name.toLowerCase().includes(query)) ||
      (item.category && item.category.toLowerCase().includes(query)) ||
      (item.author && item.author.toLowerCase().includes(query))
    );
  });

  const paginationData = paginate(filteredData, currentPage, itemsPerPage);

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
          {['games', 'blogs', 'products'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-3 rounded-lg font-semibold capitalize ${
                activeTab === tab ? 'bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {tab === 'games' ? `Jeux (${games.length})` :
               tab === 'blogs' ? `Blogs (${blogs.length})` :
               `Produits (${products.length})`}
            </button>
          ))}
        </div>

        {/* ✅ champ recherche */}
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder={`Rechercher dans ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 bg-gray-700 rounded w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
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
                    {paginationData.items.map((item: any) => (
                      <tr key={item.id} className="border-b border-gray-700 hover:bg-gray-750">
                        <td className="p-3">{item.id}</td>
                        <td className="p-3">{item.title || item.name}</td>
                        <td className="p-3">{item.category}</td>
                        <td className="p-3">
                          <Image
                            src={item.imageUrl}
                            alt={item.title || item.name}
                            width={64}
                            height={64}
                            className="object-cover rounded"
                          />
                        </td>
                        <td className="p-3 text-right">
                          <button onClick={() => { setEditingItem(item); setShowForm(true); }} className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded mr-2">Modifier</button>
                          <button onClick={() => handleDelete(item.id)} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded">Supprimer</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* pagination */}
              {paginationData.totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-6">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={!paginationData.hasPreviousPage}
                    className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50 hover:bg-gray-600"
                  >
                    Précédent
                  </button>
                  <span className="text-gray-300">
                    Page {currentPage} sur {paginationData.totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(paginationData.totalPages, prev + 1))}
                    disabled={!paginationData.hasNextPage}
                    className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50 hover:bg-gray-600"
                  >
                    Suivant
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
