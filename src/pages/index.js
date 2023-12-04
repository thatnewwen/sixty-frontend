import React, { useState } from "react"
import PropTypes from "prop-types"

import { useStaticQuery, graphql, Link } from "gatsby"
import Layout from "../components/layout"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import Seo from "../components/seo"
import Headings from "../components/headings"
import axios from "axios"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
// import { CookieNotice } from "gatsby-cookie-notice"
import withLocation from "../components/with-location"

const IndexPage = ({ queryStrings }) => {
  const { q } = queryStrings
  const {
    allStrapiTestimonial,
    strapiGlobal,
    allStrapiDiscipline,
    allStrapiDescriptor,
    search,
  } = useStaticQuery(graphql`
    query {
      allStrapiProfile(limit: 3, sort: { createdAt: ASC }) {
        nodes {
          ...ProfileCard
        }
      }
      allStrapiTestimonial(limit: 3, sort: { createdAt: ASC }) {
        edges {
          node {
            id
            name
            body
          }
        }
      }
      allStrapiDiscipline {
        edges {
          node {
            id
            name
            slug
            discipline_category {
              name
            }
          }
        }
      }
      allStrapiDescriptor {
        edges {
          node {
            id
            name
            slug
            descriptor_category {
              name
            }
          }
        }
      }
      strapiGlobal {
        siteName
        siteDescription
        homeHeaderText {
          data {
            id
            childMarkdownRemark {
              html
            }
          }
        }
        headerImage {
          localFile {
            childImageSharp {
              gatsbyImageData
            }
          }
        }
        sidebarText
      }
    }
  `)

  const [checkboxStatus, setCheckboxStatus] = useState(Array(5).fill(false))

  function buttonHandler(index) {
    let status = [...checkboxStatus]
    status[index] = !status[index]
    setCheckboxStatus(status)

    console.log(status)
    if (status.filter(status => status === true).length === 5) {
      setCookieAllow(true)
    } else {
      setCookieAllow(false)
    }
  }

  const [input, setInput] = useState("")
  const [resourceInput, setResourceInput] = useState("")
  const [selectedDisciplines, setSelectedDisciplines] = useState([])
  const [selectedDescriptors, setSelectedDescriptors] = useState([])
  const [results, setResults] = useState([])
  const [checkedDisciplinesState, setCheckedDisciplinesState] = useState(
    new Array(allStrapiDiscipline.edges.length).fill(false)
  )
  const [checkedDescriptorsState, setCheckedDescriptorsState] = useState(
    new Array(allStrapiDescriptor.edges.length).fill(false)
  )
  const [openDisciplines, setOpenDisciplines] = React.useState(false)
  const [openDescriptors, setOpenDescriptors] = React.useState(false)
  const [cookieAllow, setCookieAllow] = React.useState(false)

  const toggleDisciplines = () => {
    setOpenDisciplines(!openDisciplines)
  }
  const toggleDescriptors = () => {
    setOpenDescriptors(!openDescriptors)
  }

  const sendSearch = (value, type) => {
    let url =
      "https://sixty-backend.onrender.com" +
      "/api/profiles?populate[0]=disciplines,profilePicture"
    if (type === "input") {
      url = url.concat("&filters[name][$contains]=" + value)
    } else if (!!input) {
      url = url.concat("&filters[name][$contains]=" + input)
    }

    if (type === "descriptors") {
      const descriptorsUrl = value.join(
        "&filters[$or][1][descriptors][slug][$in]="
      )
      url = url.concat(
        "&filters[$or][0][descriptors][slug][$in]=" + descriptorsUrl
      )
    } else if (selectedDescriptors.length > 0) {
      const descriptorsUrl = selectedDescriptors.join(
        "&filters[$or][1][descriptors][slug][$in]="
      )
      url = url.concat(
        "&filters[$or][0][descriptors][slug][$in]=" + descriptorsUrl
      )
    }

    if (type === "disciplines") {
      const disciplinesUrl = value.join(
        "&filters[$or][1][disciplines][slug][$in]="
      )
      url = url.concat(
        "&filters[$or][0][disciplines][slug][$in]=" + disciplinesUrl
      )
    } else if (selectedDisciplines.length > 0) {
      const disciplinesUrl = selectedDisciplines.join(
        "&filters[$or][1][disciplines][slug][$in]="
      )
      url = url.concat(
        "&filters[$or][0][disciplines][slug][$in]=" + disciplinesUrl
      )
    }

    axios.get(url).then(response => {
      setResults(response.data.data)
    })
  }

  function PreviousArrow(props) {
    const { className, style, onClick } = props
    return (
      <div
        className="bg-white border-black border-2 w-10 h-10 font-fira rounded-full text-2xl font-bold cursor-pointer absolute top-1/2 -translate-y-1/2 -left-20 flex items-center justify-center"
        onClick={onClick}
      >&lt;</div>
    )
  }

  function NextArrow(props) {
    const { className, style, onClick } = props
    return (
      <div
        className="bg-white border-black border-2 w-10 h-10 font-fira rounded-full text-2xl font-bold cursor-pointer absolute top-1/2 -translate-y-1/2 -right-20 flex items-center justify-center"
        onClick={onClick}
      >&gt;
      </div>
    )
  }
  
  if (results.length === 0) {
    axios
      .get(
        "https://sixty-backend.onrender.com" +
          "/api/profiles?populate[0]=disciplines,profilePicture"
      )
      .then(response => {
        setResults(response.data.data)
      })
  }
  const handleInputChange = e => {
    setInput(e.target.value)
  }

  const handleResourceInputChange = e => {
    setResourceInput(e.target.value)
  }

  const handleDisciplinesChange = position => {
    const updatedCheckedDisciplinesState = checkedDisciplinesState.map(
      (item, index) => (index === position ? !item : item)
    )

    setCheckedDisciplinesState(updatedCheckedDisciplinesState)
  }

  const handleDescriptorsChange = position => {
    const updatedCheckedDescriptorsState = checkedDescriptorsState.map(
      (item, index) => (index === position ? !item : item)
    )

    setCheckedDescriptorsState(updatedCheckedDescriptorsState)
  }

  const Checkbox = ({ obj, index, check, checked, onChange }) => {
    return (
      <>
        <input
          type="checkbox"
          id={`custom-checkbox-${obj.node.slug}`}
          className={check}
          name={obj.node.slug}
          checked={checked}
          onChange={onChange}
        />
        <span className="ml-2">{obj.node.name}</span>
      </>
    )
  }

  const agreements = [
    "Assume the best of people and situations (until proven otherwise) by treating everyone you meet through this platform with grace, kindness, and respect.",
    "Listen to understand each other’s perspectives, boundaries, needs, curiosities, and opinions.",
    "Strive for clarity and accuracy with the terms, payment, timelines, and other details of gigs and collaborations, including when those terms shift and change.",
    "Place people over productivity by acknowledging that while we’re all doing incredibly important work, we’re also living during wild and challenging times.",
    "Keep things confidential between collaborators, unless consent is clearly expressed by everyone involved.",
  ]

  const handleDisciplinesApply = () => {
    const checkedBoxes = document.querySelectorAll(
      "input[class=disciplines-box]:checked"
    )
    // console.log(checkedBoxes)
    const disciplinesFilters = Array.from(checkedBoxes).map(input => {
      return input.name
    })

    setSelectedDisciplines(disciplinesFilters)
    toggleDisciplines()
    sendSearch(disciplinesFilters, "disciplines")
  }

  const handleClearDisciplines = () => {
    setSelectedDisciplines([])
    toggleDisciplines()
    setCheckedDisciplinesState(
      new Array(allStrapiDiscipline.edges.length).fill(false)
    )
    sendSearch([], "disciplines")
  }

  const handleDescriptorsApply = () => {
    const checkedBoxes = document.querySelectorAll(
      "input[class=descriptors-box]:checked"
    )
    // console.log(checkedBoxes)
    const descriptorsFilters = Array.from(checkedBoxes).map(input => {
      return input.name
    })

    setSelectedDescriptors(descriptorsFilters)
    toggleDescriptors()
    sendSearch(descriptorsFilters, "descriptors")
  }

  const handleClearDescriptors = () => {
    setSelectedDescriptors([])
    toggleDescriptors()
    setCheckedDescriptorsState(
      new Array(allStrapiDiscipline.edges.length).fill(false)
    )
    sendSearch([], "descriptors")
  }

  function disciplines() {
    return (
      <div className="border-2 border-black rounded-2xl">
        <div className="p-5">
          {allStrapiDiscipline.edges.map((discipline, index) => {
            return (
              <li className="list-none" key={index}>
                <Checkbox
                  obj={discipline}
                  index={index}
                  check="disciplines-box"
                  checked={checkedDisciplinesState[index]}
                  onChange={() => handleDisciplinesChange(index)}
                />
              </li>
            )
          })}
        </div>
        <div className="flex border-t-2 border-black p-5 justify-between items-center">
          <a href="#" onClick={handleClearDisciplines}>
            Clear All
          </a>
          <button
            className="rounded-full px-3 text-sm bg-black text-white p-1 border-black border-2"
            onClick={handleDisciplinesApply}
          >
            Apply
          </button>
        </div>
      </div>
    )
  }

  const disciplinesSection = openDisciplines ? (
    <div className="absolute bg-white mt-3">{disciplines()}</div>
  ) : (
    <span></span>
  )

  function descriptors() {
    return (
      <div className="border-2 border-black rounded-2xl">
        <div className="p-5">
          {allStrapiDescriptor.edges.map((descriptor, index) => {
            return (
              <li className="list-none" key={index}>
                <Checkbox
                  obj={descriptor}
                  index={index}
                  check="descriptors-box"
                  checked={checkedDescriptorsState[index]}
                  onChange={() => handleDescriptorsChange(index)}
                />
              </li>
            )
          })}
        </div>
        <div className="flex border-t-2 border-black p-5 justify-between items-center">
          <a href="#" onClick={handleClearDescriptors}>
            Clear All
          </a>
          <button
            className="rounded-full px-3 text-sm bg-black text-white p-1 border-black border-2"
            onClick={handleDescriptorsApply}
          >
            Apply
          </button>
        </div>
      </div>
    )
  }

  const descriptorsSection = openDescriptors ? (
    <div className="absolute bg-white mt-3">{descriptors()}</div>
  ) : (
    <span></span>
  )

  return (
    <Layout sidebarText={strapiGlobal.sidebarText}>
      <Seo seo={{ metaTitle: "Home" }} />
      <Headings
        title={strapiGlobal.siteName}
        description={strapiGlobal.siteDescription}
      />
      <main className="flex flex-col justify-center items-center width-full">
      <GatsbyImage
          image={getImage(strapiGlobal.headerImage?.localFile)}
          alt={strapiGlobal.headerImage?.alternativeText}
          className="w-full max-h-96"
        />
        <div className="w-full">
          <h1 className="text-xl w-full bg-black text-white text-center p-5">
            <div
              dangerouslySetInnerHTML={{
                __html:
                  strapiGlobal.homeHeaderText.data.childMarkdownRemark.html,
              }}
            />
          </h1>
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
          <div className="flex flex-col border-r-2 border-black">
            <h2 className="text-5xl text-center uppercase font-bold w-full px-8 pt-10 member-gradient">
              Member <br/>Profiles
            </h2>
            <div className="">
              <div className="flex w-full align-center justify-center">
              <p className="p-10 text-center max-w-md poppins">
              Learn about our members, hire talent, find collaborators, and more.
              </p>

              </div>
              <div className="flex flex border-black p-8 rounded-t-3xl member-gradient top-curve-border flex-col">
                <div className="w-full text-center">
                  <input
                    className=" rounded-full px-3 text-sm border-2 border-black p-1 w-3/6"
                    placeholder="Enter 'Name'"
                    value={input}
                    onChange={handleInputChange}
                  />
                  <Link className="w-full text-center" href={"/profiles?q=" + input}>
                    <button className="ml-2 rounded-full px-3 text-sm bg-black text-white p-1 border-black border-2">
                      Search
                    </button>
                  </Link>
                </div>
                <div className="w-full text-center mt-5 underline font-bold">
                <Link href={"/profiles"}>View All Member Profiles</Link>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col border-r-2 border-black">
            <h2 className="text-5xl text-center uppercase font-bold w-full px-8 pt-10 knowledge-gradient">
              Knowledge <br/>Share
            </h2>
            <div className="">
              <div className="flex w-full align-center justify-center">
              <p className="p-10 text-center max-w-md poppins">
              Browse through our carefully selected articles, tools, career advice, and more.
              </p>

              </div>
              <div className="flex flex border-black p-8 rounded-t-3xl knowledge-gradient top-curve-border flex-col">
                <div className="w-full text-center">
                  <input
                    className=" rounded-full px-3 text-sm border-2 border-black p-1 w-3/6"
                    placeholder="Enter 'Taxes'"
                    value={resourceInput}
                    onChange={handleResourceInputChange}
                  />
                  <Link className="w-full text-center" href={"/resources?q=" + resourceInput}>
                    <button className="ml-2 rounded-full px-3 text-sm bg-black text-white p-1 border-black border-2">
                      Search
                    </button>
                  </Link>
                </div>
                <div className="w-full text-center mt-5 underline font-bold">
                <Link href={"/resources"}>View All Resources</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col width-full justify-center items-center container p-10">
          <h3 className="text-3xl font-black text-center">Paid opportunities, grants, residencies,<br/> and more sent to your inbox.</h3>
          <button className="rounded-full text-black text-sm px-2 py-1 mt-5 border-2 border-black w-48">
            Sign Me Up
          </button>
        </div>
        <div className="w-full flex items-center justify-center bg-purple py-20">
          <div className="w-1/2">
        <Slider
          dots={false}
          infinite={true}
          speed={300}
          slidesToShow={1}
          slidesToScroll={1}
          arrows={true}
          swipe={true}
          adaptiveHeight={true}
          nextArrow={<NextArrow />}
          prevArrow={<PreviousArrow />}
        >
          {allStrapiTestimonial.edges.map((testimonial, index) => (
            <div
            className="border-black border-2 rounded-3xl bg-white p-5 font-fira text-center"
            key={index}
          >
            {testimonial.node.body}
          </div>
          ))}
        </Slider>
        <div className="text-center pt-10">
            <a className="underline font-bold" href="/testimonials">Submit a Testimonial</a>

        </div>
          </div>
        </div>
        <div>
        </div>
      </main>
      {/* <CookieNotice
        acceptButtonText="Agree & Enter"
        declineButton={false}
        backgroundClasses=""
        personalizeButtonEnable={false}
        acceptButtonClasses={
          "rounded-full px-3 text-sm bg-black text-white p-1 border-black border-2 " +
          (cookieAllow ? "cookieAllow" : "cookieNotAllow")
        }
        backgroundWrapperClasses="absolute w-full h-full top-0 left-0 bg-gray-400/75"
        buttonWrapperClasses="pb-10 flex justify-center bg-white w-1/2 border-b-2 border-l-2 border-r-2 rounded-b-3xl border-black m-auto"
      >
        <div className="m-auto w-1/2 bg-white mt-20 flex flex-col gap-3 bg-white rounded-t-3xl border-t-2 border-l-2 border-r-2 border-black">
          <h2 className="text-xl font-bold bg-black text-white w-full px-8 p-2 rounded-t-2xl">
            Community Agreements
          </h2>
          <div className="p-10">
            {Array(5)
              .fill(0)
              .map((_, index) => (
                <li className="list-none flex">
                  <input
                    type="checkbox"
                    checked={checkboxStatus[index]}
                    onChange={() => buttonHandler(index)}
                  />
                  <span className="ml-5 mt-5 mb-5">{agreements[index]}</span>
                </li>
              ))}
            <p>
              This website uses cookies to keep track of whether the Community
              Agreements has been accepted.
            </p>
          </div>
        </div>
      </CookieNotice> */}
    </Layout>
  )
}

IndexPage.propTypes = {
  queryStrings: PropTypes.object,
}

export default withLocation(IndexPage)
