interface Props{
  userName: string;
  gender: string;
}

export default function UserCard({ userName, gender }: Props) {
  return (
    <>
      <p>{userName}</p>
      <p>{gender}</p>
    </>
  );
}
