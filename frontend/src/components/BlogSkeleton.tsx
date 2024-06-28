import { Circle } from "./BlogCard";

const BlogSkeleton = () => {
    return (
        <div role="status" className="animate-pulse">
            <div className="p-4 border-b border-slate-200 pb-4 w-screen max-w-screen-md cursor-pointer">
                <div className="flex items-center">
                    {/* Placeholder for circle */}
                    <div className="h-4 w-4 bg-gray-200 rounded-full mr-2"></div>

                    {/* Placeholder lines */}
                    <div className="flex flex-col flex-grow">
                        <div className="h-2 bg-gray-200 rounded-full mb-1"></div>
                        <div className="h-2 bg-gray-200 rounded-full mb-1"></div>
                    </div>

                    {/* Placeholder for custom Circle component */}
                    <div className="pl-2">
                        <Circle />
                    </div>
                </div>

                {/* Placeholder for title */}
                <div className="text-xl font-semibold pt-2">
                    <div className="h-2 bg-gray-200 rounded-full mb-1"></div>
                </div>

                {/* Placeholder for content */}
                <div className="text-md font-thin">
                    <div className="h-2 bg-gray-200 rounded-full mb-1"></div>
                    <div className="h-2 bg-gray-200 rounded-full mb-1"></div>
                    <div className="h-2 bg-gray-200 rounded-full mb-1"></div>
                </div>

                {/* Placeholder for metadata */}
                <div className="text-slate-500 text-sm font-thin pt-4">
                    <div className="h-2 bg-gray-200 rounded-full mb-1"></div>
                </div>
            </div>
            <span className="sr-only">Loading...</span>
        </div>
    );
};

export default BlogSkeleton;
