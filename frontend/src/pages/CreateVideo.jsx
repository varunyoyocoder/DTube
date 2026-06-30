import { useState } from "react";
import api from "../services/api";

function CreateVideo() {

    const [title, setTitle] = useState("");

    const [description, setDescription] = useState("");

    const [category, setCategory] = useState("");

    const [thumbnail, setThumbnail] = useState(null);

    const [video, setVideo] = useState(null);

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!thumbnail || !video) {
            alert("Choose both thumbnail and video.");
            return;
        }

        const formData = new FormData();

        formData.append("title", title);

        formData.append("description", description);

        formData.append("category", category);

        formData.append("thumbnail", thumbnail);

        formData.append("video", video);

        try {

            const response = await api.post(
                "/user/createVideo",
                formData,
                {
                    headers: {
                        "Content-Type":
                            "multipart/form-data",
                    },
                }
            );

            alert(response.data.message);

            setTitle("");

            setDescription("");

            setCategory("");

            setThumbnail(null);

            setVideo(null);

        } catch (err) {

            console.log(err);

            alert("Upload failed");

        }

    };

    return (

        <form onSubmit={handleSubmit}>

            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e)=>setTitle(e.target.value)}
            />

            <br /><br />

            <textarea
                placeholder="Description"
                value={description}
                onChange={(e)=>setDescription(e.target.value)}
            />

            <br /><br />

            <input
                type="text"
                placeholder="Category"
                value={category}
                onChange={(e)=>setCategory(e.target.value)}
            />

            <br /><br />

            Thumbnail

            <input
                type="file"
                accept="image/*"
                onChange={(e)=>
                    setThumbnail(e.target.files[0])
                }
            />

            <br /><br />

            Video

            <input
                type="file"
                accept="video/*"
                onChange={(e)=>
                    setVideo(e.target.files[0])
                }
            />

            <br /><br />

            <button type="submit">

                Upload Video

            </button>

        </form>

    );

}

export default CreateVideo;