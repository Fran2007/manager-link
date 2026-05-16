import { useState } from "react"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Trash2 } from "lucide-react"

type Link = {
  title: string;
  url: string;
};

type LinkFormData = {
  title: string;
  url: string;
};

type ShowLinksProps = {
  handleAddLink: () => void | Promise<void>;
  handleDeleteChange: (index: number) => void;
  links: Link[];
  formData: LinkFormData;
  setFormData: React.Dispatch<React.SetStateAction<LinkFormData>>;
};

export const ShowLinks: React.FC<ShowLinksProps> = ({ handleAddLink, handleDeleteChange, links, formData, setFormData }) => {
  const [open, setOpen] = useState(false)

  const handleAdd = async () => {
    await handleAddLink()
    setOpen(false)
  }

    return (
        <div className="space-y-4">
            {/* Links List */}
            <div className="space-y-3">
                {links.length === 0 && (
                    <p className="text-center text-gray-500 text-sm py-4">No links added yet</p>
                )}
                {links.map((link, index) => (
                    <div
                        key={index}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 font-medium hover:underline"
                        >
                            {link.title}
                        </a>
                        <button
                            onClick={() => handleDeleteChange(index)}
                            className="p-1 rounded hover:bg-red-100 text-red-500 transition-colors"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Add Link Button */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button className="w-full" variant="outline">+ Add new link</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold">Add new link</DialogTitle>
                        <DialogDescription className="text-gray-500">
                            Save your new link below.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                                placeholder="Example"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="url">URL</Label>
                            <Input
                                id="url"
                                name="url"
                                value={formData.url}
                                onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
                                placeholder="https://example.com"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button onClick={handleAdd} type="button">Add</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

