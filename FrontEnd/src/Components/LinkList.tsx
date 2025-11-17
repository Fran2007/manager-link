import {useState, useEffect} from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { apiService, type Folder, type Link } from "../services/api"
import { ShowLinks } from "./ShowLinks"
import {Avatar, AvatarFallback, AvatarImage} from "./ui/avatar"
import { Button } from "./ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { LogOut, FolderPlus, FolderOpen, Trash2 } from "lucide-react"

import GithubIcon from "@mui/icons-material/GitHub"
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';

export const LinkList = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [folders, setFolders] = useState<Folder[]>([])
    const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null)
    const [folderLinks, setFolderLinks] = useState<Link[]>([])
    const [newFolderName, setNewFolderName] = useState('')
    const [linkData, setLinkData] = useState({
        title: '',
        url: ''
    })
  
    useEffect(() => {
        fetchFolders()
    }, [])

    useEffect(() => {
        if (selectedFolder) {
            fetchFolderLinks(selectedFolder._id)
        }
    }, [selectedFolder])
  
    const fetchFolders = async () => {
        try {
            const foldersData = await apiService.getFolders()
            setFolders(foldersData)
        } catch (error) {
            console.error('Error fetching folders:', error)
        }
    }

    const fetchFolderLinks = async (folderId: string) => {
        try {
            const folderData = await apiService.getFolder(folderId)
            setFolderLinks(folderData.links || [])
        } catch (error) {
            console.error('Error fetching folder links:', error)
        }
    }
  
    const handleCreateFolder = async () => {
        if (!newFolderName.trim()) return
        
        try {
            const newFolder = await apiService.createFolder({ name: newFolderName })
            setFolders([...folders, newFolder])
            setNewFolderName('')
        } catch (error) {
            console.error('Error creating folder:', error)
        }
    }

    const handleDeleteFolder = async (folderId: string) => {
        try {
            await apiService.deleteFolder(folderId)
            setFolders(folders.filter(f => f._id !== folderId))
            if (selectedFolder?._id === folderId) {
                setSelectedFolder(null)
                setFolderLinks([])
            }
        } catch (error) {
            console.error('Error deleting folder:', error)
        }
    }
  
    const handleAddLink = async () => {
        if (!linkData.title || !linkData.url || !selectedFolder) return
        
        try {
            const newLink = await apiService.createLink({
                title: linkData.title,
                url: linkData.url,
                folderId: selectedFolder._id
            })
            setFolderLinks([...folderLinks, newLink])
            setLinkData({ title: '', url: '' })
        } catch (error) {
            console.error('Error creating link:', error)
        }
    }

    const handleDeleteLink = async (linkId: string) => {
        try {
            await apiService.deleteLink(linkId)
            setFolderLinks(folderLinks.filter(l => l._id !== linkId))
        } catch (error) {
            console.error('Error deleting link:', error)
        }
    }

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

     return (
        <div className="relative min-h-screen">
            {/* Logout Button - Esquina superior derecha */}
            <div className="fixed top-4 right-4 z-50">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-gray-800 bg-white shadow-md"
                >
                    <LogOut size={16} className="mr-2" />
                    Logout
                </Button>
            </div>

            <div className="max-w-2xl mx-auto p-6 kindle-paper rounded-xl border shadow-sm">
                {/* Fondo con efecto rasgado */}
                <div className="absolute inset-0 z-0 torn-effect"></div>

                {/* Contenido */}
                <div className="relative z-10 space-y-6">
                    {/* User Profile Section */}
                    <div className="flex flex-col items-center bg-white shadow-sm rounded-xl p-5 text-center">
                        <Avatar className="h-16 w-16 mb-4">
                            <AvatarImage src="https://github.com/peduarte.png" alt={user?.username} />
                            <AvatarFallback>{user ? getInitials(user.username) : 'U'}</AvatarFallback>
                        </Avatar>
                        <h1 className="text-xl font-semibold text-gray-800">
                            {user ? `I'm ${user.username}` : 'Welcome'}
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            {user?.email || 'I like creating things and learning new technologies'}
                        </p>
                        
                        {/* Social Media Icons */}
                        <div className="flex gap-3 mt-4">
                            <a href="https://www.youtube.com/@ridddlees4931"><YouTubeIcon fontSize="medium" className="py-0.5"/></a>
                            <a href="https://www.instagram.com/midu.dev/?hl=es"><InstagramIcon fontSize="medium" className="py-0.5"/></a>
                            <a href=""><GithubIcon fontSize="medium" className="py-0.5"/></a>
                        </div>
                    </div>

                    {/* Folders Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-semibold text-lg">Carpetas</h2>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        <FolderPlus size={16} className="mr-2" />
                                        Agregar Carpeta
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Nueva Carpeta</DialogTitle>
                                        <DialogDescription>
                                            Crea una nueva carpeta para organizar tus links.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="folderName">Nombre de la carpeta</Label>
                                            <Input
                                                id="folderName"
                                                value={newFolderName}
                                                onChange={(e) => setNewFolderName(e.target.value)}
                                                placeholder="Mi Carpeta"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        handleCreateFolder()
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="outline">Cancelar</Button>
                                        </DialogClose>
                                        <Button onClick={handleCreateFolder}>Crear</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>

                        {/* Folders List */}
                        <div className="space-y-2">
                            {folders.length === 0 && (
                                <p className="text-center text-gray-500 text-sm py-4">No hay carpetas. Crea una para empezar.</p>
                            )}
                            {folders.map((folder) => (
                                <div
                                    key={folder._id}
                                    className={`flex justify-between items-center p-3 rounded-lg transition-colors cursor-pointer ${
                                        selectedFolder?._id === folder._id
                                            ? 'bg-blue-100 border-2 border-blue-300'
                                            : 'bg-gray-50 hover:bg-gray-100'
                                    }`}
                                    onClick={() => setSelectedFolder(folder)}
                                >
                                    <div className="flex items-center gap-2">
                                        <FolderOpen size={20} className="text-blue-600" />
                                        <span className="font-medium">{folder.name}</span>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            if (confirm('¿Estás seguro de eliminar esta carpeta y todos sus links?')) {
                                                handleDeleteFolder(folder._id)
                                            }
                                        }}
                                        className="p-1 rounded hover:bg-red-100 text-red-500 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Links Section - Solo se muestra si hay una carpeta seleccionada */}
                    {selectedFolder && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="font-semibold text-lg">Links en "{selectedFolder.name}"</h2>
                            </div>
                            
                            <ShowLinks
                                handleAddLink={handleAddLink}
                                handleDeleteChange={(index: number) => {
                                    const link = folderLinks[index]
                                    if (link?._id) {
                                        handleDeleteLink(link._id)
                                    }
                                }}
                                data={{
                                    links: folderLinks.map(l => ({ title: l.title, url: l.url })),
                                    title: linkData.title,
                                    url: linkData.url
                                }}
                                setData={(newData) => {
                                    const updated = typeof newData === 'function' 
                                        ? newData({
                                            links: folderLinks.map(l => ({ title: l.title, url: l.url })),
                                            title: linkData.title,
                                            url: linkData.url
                                        })
                                        : newData
                                    setLinkData({ title: updated.title, url: updated.url })
                                }}
                            />
                        </div>
                    )}

                    {!selectedFolder && folders.length > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                            <p className="text-blue-700 text-sm">Selecciona una carpeta para ver y agregar links</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
