import CardContact from "@/containers/Contact/CardContact"
import SendMailContact from "@/containers/Contact/SendMail"

const ContactPage = () => {
  return (
    <div className="w-full">
      <div className="max-w-(--max-width-desktop) lg-max-w-(--max-width-desktop) mx-auto w-full pb-20 pt-14 px-5">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-center">Get in Touch</h1>
          <p className="text-center max-w-[450px]">Contact us to publish your content and show ads to our website and get a good reach.</p>
        </div>
        <div className="mt-12">
          <CardContact />
        </div>
      </div>
      <SendMailContact />
    </div>
  )
}
export default ContactPage