import {useState} from "react"
import { ShowLinks } from "./ShowLinks"
import {Avatar, AvatarFallback, AvatarImage} from "./ui/avatar"

import GithubIcon from "@mui/icons-material/GitHub"
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';

interface LinkType {
    title: string;
    url: string;
}

export const LinkList = () => {
  
    const [data, setData] = useState({
        links: [] as LinkType[],
        title: '',
        url: ''
    })
  
    const handleAddLink = () => {
        setData({...data, links: [...data.links, {title: data.title, url: data.url}], title: '', url: ''})
    }

    const handleDeleteChange = (index: number) => {
        setData({...data, links: data.links.filter(((_,i) => i !== index))})
    }

     return (
        <div className="relative max-w-2xl  p-6 kindle-paper rounded-xl border shadow-sm">
            {/* Fondo con efecto rasgado */}
            <div className="absolute inset-0 z-0 torn-effect"></div>

            {/* Contenido */}
            <div className="relative z-10 space-y-6">
                {/* User Profile Section */}
                <div className="flex flex-col items-center bg-white shadow-sm rounded-xl p-5 text-center">
                    <Avatar className="h-16 w-16 mb-4">
                        <AvatarImage src="https://github.com/peduarte.png" alt="@peduarte" />
                        <AvatarFallback>PD</AvatarFallback>
                    </Avatar>
                    <h1 className="text-xl font-semibold text-gray-800">I'm Franklin</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        I like creating things and learning new technologies
                    </p>
                    
                    {/* Social Media Icons - Añade tus iconos reales aquí */}
                    <div className="flex gap-3 mt-4">
                        {/* Ejemplo de iconos - reemplaza con tus componentes reales */}
                        <a href="https://www.youtube.com/@ridddlees4931"><YouTubeIcon fontSize="medium" className="py-0.5"/></a>
                        <a href="https://www.instagram.com/midu.dev/?hl=es"><InstagramIcon fontSize="medium" className="py-0.5"/></a>
                        <a href=""><GithubIcon fontSize="medium" className="py-0.5"/></a>
                    </div>
                </div>

                {/* Links Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-semibold text-lg">Links</h2>
                    </div>
                    
                    <ShowLinks
                        handleAddLink={handleAddLink}
                        handleDeleteChange={handleDeleteChange}
                        data={data}
                        setData={setData}
                    />
                </div>
            </div>
        </div>
    )
}
