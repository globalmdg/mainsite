
type Props = {
    text: string
}

const CTAButton = (props: Props) => {
  return (
    <div className="bg-blue-500 rounded-3xl font-semibold cursor-pointer hover:bg-blue-600 text-white text-sm px-6 py-3">{props.text}</div>
  )
}
export default CTAButton