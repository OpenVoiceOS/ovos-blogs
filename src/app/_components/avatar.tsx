type Props = {
  name: string;
  picture: string;
};

const Avatar = ({ name, picture }: Props) => {
  return (
    <div className="flex items-center">
      <div className="w-8 h-8 rounded-full overflow-hidden mr-3 ring-2 ring-mono-200 dark:ring-mono-700">
        <img src={picture} className="w-full h-full object-cover" alt={name} />
      </div>
      <div className="text-sm font-medium text-mono-800 dark:text-mono-200">
        {name}
      </div>
    </div>
  );
};

export default Avatar;
