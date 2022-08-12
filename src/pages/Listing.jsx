import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase.config";
import Spinner from "../components/Spinner";
import shareIcon from "../assets/svg/shareIcon.svg";
import { Pagination, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/a11y";

const Listing = () => {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);

  const navigate = useNavigate();
  const params = useParams();
  const auth = getAuth();

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setListing(docSnap.data());
        setLoading(false);
      }
    };

    fetchListing();
  }, [navigate, params.listingId]);

  if (loading) {
    return <Spinner />;
  }
  return (
    <main>
      <Swiper
        slidesPerView={1}
        pagination={{ clickable: true }}
        modules={[Pagination, A11y]}
      >
        {listing.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              style={{
                background: `url(${listing.imgUrls[index]}) center no-repeat`,
                backgroundSize: "cover",
                minHeight: "26rem",
              }}
              className="swiperSlideDiv"
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div
        className="shareIconDiv"
        onClick={() => {
          navigator.clipboard
            .writeText(window.location.href)
            .then(() => console.log("Copied"))
            .catch(() => console.log("Failed"));
          setShareLinkCopied(true);
          setTimeout(() => {
            setShareLinkCopied(false);
          }, 2000);
        }}
      >
        <img src={shareIcon} alt="" />
      </div>
      {shareLinkCopied && <p className="linkCopied">Link Copied</p>}
      <div className="listingDetails">
        <p className="listingName">
          {listing.name} - ₹
          {listing.offer
            ? parseInt(listing.discountedPrice).toLocaleString("en-IN")
            : parseInt(listing.regularPrice).toLocaleString("en-IN")}
        </p>
        <p className="listingAddress">{listing.address}</p>
        <p className="listingType">
          For {listing.type === "rent" ? "Rent" : "Sale"}
        </p>
        {listing.offer && (
          <p className="discountPrice">
            ₹{" "}
            {parseInt(
              listing.regularPrice - listing.discountedPrice
            ).toLocaleString("en-IN")}{" "}
            Discount
          </p>
        )}
        <ul className="listingDetailsList">
          <li>
            {listing.bedrooms > 1
              ? `${listing.bedrooms} Bedrooms`
              : "1 Bedroom"}
          </li>
          <li>
            {listing.bathrooms > 1
              ? `${listing.bathrooms} Bathrooms`
              : "1 Bathroom"}
          </li>
          <li>{listing.parking && "Parking Spot "}</li>
          <li>{listing.furnished && "Furnished "}</li>
        </ul>

        {auth.currentUser?.uid !== listing.userRef && (
          <ul className="contactListItems">
            <li className="contactListItem">
              <a className="buttonSmall" href={`tel:${listing.phone}`}>
                Call
              </a>
            </li>
            <li className="navbarListItem">
              <Link
                to={`/contact/${listing.userRef}?listingName=${listing.name}`}
                className="buttonSmall"
              >
                Send a message
              </Link>
            </li>
          </ul>
        )}
      </div>
    </main>
  );
};

export default Listing;
