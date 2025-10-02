import { SharesPerMentalHealthExpert } from './SharesPerMentalHealthExpert/SharesPerMentalHealthExpert'
import { ShareViaLink } from './share-export/share/ShareViaLink/ShareViaLink'
import { Navbar } from './shared/Navbar/Navbar'

export const SharedPosts = () => {
  return (
    <>
      <Navbar />
      {/* Share via link */}
      <ShareViaLink />
      {/* Shares per doctor to make */}
      <SharesPerMentalHealthExpert />
    </>
  )
}
