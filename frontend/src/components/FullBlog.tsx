import { Blog } from "../hooks";
import { Appbar } from "./Appbar";
import { Avatar } from "./BlogCard";

export const FullBlog = ({ blog }: { blog: Blog }) => {
  return (
    <div>
      <Appbar />
      <div className="flex justify-center bg-gray-50 min-h-screen py-8">
        <div className="bg-white shadow-lg rounded-lg grid grid-cols-12 px-10 w-full max-w-screen-xl py-12">
          <div className="col-span-8 pr-8 border-r border-gray-200">
            <div className="text-5xl font-extrabold text-gray-900">
              {blog.title}
            </div>
            <div className="text-slate-500 pt-2">
              Posted on 2nd December 2023
            </div>
            <div className="pt-4 text-lg text-gray-700 leading-relaxed">
              {blog.content}
            </div>
          </div>
          <div className="col-span-4 pl-8">
            <div className="text-slate-600 text-lg mb-4">Author</div>
            <div className="flex items-center">
              <div className="pr-4">
                <Avatar size="big" name={blog.author.name || "Anonymous"} />
              </div>
              <div>
                <div className="text-xl font-bold text-gray-800">
                  {blog.author.name || "Anonymous"}
                </div>
                <div className="pt-2 text-slate-500 text-sm italic">
                  Random catch phrase about the author's ability to grab the user's attention
                </div>
              </div>
            </div>  
          </div>
        </div>
      </div>
    </div>
  );
};
