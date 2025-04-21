import Link from "next/link"

type Props = {
  text: string
  link: string
}

const CTAButton = (props: Props) => {
  return (
    <Link href={props.link} className="w-full">
      <div className="bg-gray-800 rounded-lg flex justify-center sm:justify-start sm:bg-blue-600 sm:rounded-3xl font-semibold cursor-pointer hover:bg-blue-600 text-white text-sm px-6 py-3">{props.text}</div>
    </Link>
  )
}
export default CTAButton