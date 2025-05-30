type Props = {
  children?: React.ReactNode;
};

const Container = ({ children }: Props) => {
  return <div className="container mx-auto px-5 text-mono-800 dark:text-mono-100">{children}</div>;
};

export default Container;
