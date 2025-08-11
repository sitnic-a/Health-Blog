import { SharesPerMentalHealthExpert } from './SharesPerMentalHealthExpert/SharesPerMentalHealthExpert'
import { ShareViaLink } from './share-export/share/ShareViaLink'

export const SharedPosts = () => {
  return (
    <>
      {/* Share via link */}
      <ShareViaLink />
      {/* Shares per doctor to make */}
      <SharesPerMentalHealthExpert />
    </>
  )
}
