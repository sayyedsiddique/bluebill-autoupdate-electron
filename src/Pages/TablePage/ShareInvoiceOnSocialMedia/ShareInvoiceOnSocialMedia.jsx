import React from 'react'
import "./ShareInvoiceOnSocialMedia.css";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import {
    EmailIcon,
    EmailShareButton,
    FacebookIcon,
    FacebookMessengerIcon,
    FacebookMessengerShareButton,
    FacebookShareButton,
    FacebookShareCount,
    GabIcon,
    GabShareButton,
    HatenaIcon,
    HatenaShareButton,
    HatenaShareCount,
    InstapaperIcon,
    InstapaperShareButton,
    LineIcon,
    LineShareButton,
    LinkedinIcon,
    LinkedinShareButton,
    LivejournalIcon,
    LivejournalShareButton,
    MailruIcon,
    MailruShareButton,
    PinterestIcon,
    PinterestShareButton,
    PinterestShareCount,
    PocketIcon,
    PocketShareButton,
    RedditIcon,
    RedditShareButton,
    RedditShareCount,
    TelegramIcon,
    TelegramShareButton,
    TumblrIcon,
    TumblrShareButton,
    TumblrShareCount,
    TwitterIcon,
    TwitterShareButton,
    VKShareButton,
    ViberIcon,
    ViberShareButton,
    WeiboIcon,
    WeiboShareButton,
    WhatsappIcon,
    WhatsappShareButton,
    WorkplaceIcon,
    WorkplaceShareButton,
    XIcon
} from 'react-share';

const ShareInvoiceOnSocialMedia = ({ isOpen, onClose }) => {

    const shareUrl = "http://github.com";
    const facbookUrl ="https://www.facebook.com"

    const title = "Invoice";
    return (
        <Modal isOpen={isOpen} toggle={onClose}>
            <ModalHeader>
                <p>Share</p>
            </ModalHeader>
            <ModalBody>
                <div className="Demo__container">
                    <div className="Demo__some-network">
                        <FacebookShareButton
                            url={facbookUrl}
                            className="Demo__some-network__share-button"
                        >
                            <FacebookIcon size={32} round />
                        </FacebookShareButton>

                    </div>

                    <div className="Demo__some-network">
                        <FacebookMessengerShareButton
                            url={shareUrl}
                            appId="521270401588372"
                            className="Demo__some-network__share-button"
                        >
                            <FacebookMessengerIcon size={32} round />
                        </FacebookMessengerShareButton>
                    </div>

                    <div className="Demo__some-network">
                        <TwitterShareButton
                            url={shareUrl}
                            title={title}
                            className="Demo__some-network__share-button"
                        >
                            <XIcon size={32} round />
                        </TwitterShareButton>
                    </div>

                    <div className="Demo__some-network">
                        <TelegramShareButton
                            url={shareUrl}
                            title={title}
                            className="Demo__some-network__share-button"
                        >
                            <TelegramIcon size={32} round />
                        </TelegramShareButton>
                    </div>

                    <div className="Demo__some-network">
                        <WhatsappShareButton
                            url={shareUrl}
                            title={title}
                            // separator=":: "
                            className="Demo__some-network__share-button"
                        >
                            <WhatsappIcon size={32} round />
                        </WhatsappShareButton>
                    </div>

                    <div className="Demo__some-network">
                        <LinkedinShareButton
                            url={shareUrl}
                            className="Demo__some-network__share-button"
                        >
                            <LinkedinIcon size={32} round />
                        </LinkedinShareButton>
                    </div>

                    <div className="Demo__some-network">
                        <PinterestShareButton
                            url={String(window.location)}
                            className="Demo__some-network__share-button"
                        >
                            <PinterestIcon size={32} round />
                        </PinterestShareButton>

                    </div>


                    <div className="Demo__some-network">
                        <RedditShareButton
                            url={shareUrl}
                            title={title}
                            windowWidth={660}
                            windowHeight={460}
                            className="Demo__some-network__share-button"
                        >
                            <RedditIcon size={32} round />
                        </RedditShareButton>

                    </div>

                    <div className="Demo__some-network">
                        <GabShareButton
                            url={shareUrl}
                            title={title}
                            windowWidth={660}
                            windowHeight={640}
                            className="Demo__some-network__share-button"
                        >
                            <GabIcon size={32} round />
                        </GabShareButton>
                    </div>

                    <div className="Demo__some-network">
                        <TumblrShareButton
                            url={shareUrl}
                            title={title}
                            className="Demo__some-network__share-button"
                        >
                            <TumblrIcon size={32} round />
                        </TumblrShareButton>

                    </div>

                    <div className="Demo__some-network">
                        <LivejournalShareButton
                            url={shareUrl}
                            title={title}
                            description={shareUrl}
                            className="Demo__some-network__share-button"
                        >
                            <LivejournalIcon size={32} round />
                        </LivejournalShareButton>
                    </div>

                    <div className="Demo__some-network">
                        <MailruShareButton
                            url={shareUrl}
                            title={title}
                            className="Demo__some-network__share-button"
                        >
                            <MailruIcon size={32} round />
                        </MailruShareButton>
                    </div>

                    <div className="Demo__some-network">
                        <EmailShareButton
                            url={shareUrl}
                            subject={title}
                            body="body"
                            className="Demo__some-network__share-button"
                        >
                            <EmailIcon size={32} round />
                        </EmailShareButton>
                    </div>

                    <div className="Demo__some-network">
                        <ViberShareButton
                            url={shareUrl}
                            title={title}
                            className="Demo__some-network__share-button"
                        >
                            <ViberIcon size={32} round />
                        </ViberShareButton>
                    </div>

                    <div className="Demo__some-network">
                        <WorkplaceShareButton
                            url={shareUrl}
                            quote={title}
                            className="Demo__some-network__share-button"
                        >
                            <WorkplaceIcon size={32} round />
                        </WorkplaceShareButton>
                    </div>

                    <div className="Demo__some-network">
                        <LineShareButton
                            url={shareUrl}
                            title={title}
                            className="Demo__some-network__share-button"
                        >
                            <LineIcon size={32} round />
                        </LineShareButton>
                    </div>

                    <div className="Demo__some-network">
                        <WeiboShareButton
                            url={shareUrl}
                            title={title}
                            className="Demo__some-network__share-button"
                        >
                            <WeiboIcon size={32} round />
                        </WeiboShareButton>
                    </div>

                    <div className="Demo__some-network">
                        <PocketShareButton
                            url={shareUrl}
                            title={title}
                            className="Demo__some-network__share-button"
                        >
                            <PocketIcon size={32} round />
                        </PocketShareButton>
                    </div>

                    <div className="Demo__some-network">
                        <InstapaperShareButton
                            url={shareUrl}
                            title={title}
                            className="Demo__some-network__share-button"
                        >
                            <InstapaperIcon size={32} round />
                        </InstapaperShareButton>
                    </div>

                    <div className="Demo__some-network">
                        <HatenaShareButton
                            url={shareUrl}
                            title={title}
                            windowWidth={660}
                            windowHeight={460}
                            className="Demo__some-network__share-button"
                        >
                            <HatenaIcon size={32} round />
                        </HatenaShareButton>


                    </div>

                </div>

            </ModalBody>
            {/* <ModalFooter>
                <Button onClick={onClose}>Close</Button>
            </ModalFooter> */}
        </Modal>
    )
}

export default ShareInvoiceOnSocialMedia
