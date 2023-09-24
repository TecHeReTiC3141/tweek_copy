import React from "react"
import HeaderBtn from "./HeaderBtn"
import { useSearchParams } from "react-router-dom";

const Header = () => {

  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const [searchParams, setSearchParams] = useSearchParams()
  function openLoginForm() {
    const loginFormBlur = document.querySelector('[data-id="login-form"]')
    loginFormBlur.classList.add("active")
  }

  function toPrevWeek() {
    let curShift = +searchParams.get("weekShift") || 0;
    setSearchParams(prevSearchParams => {
      prevSearchParams.set("weekShift", `${--curShift}`);
      return prevSearchParams;
    })
  }

  function toNextWeek() {
    let curShift = +searchParams.get("weekShift") || 0;
    setSearchParams(prevSearchParams => {
      prevSearchParams.set("weekShift", `${++curShift}`);
      return prevSearchParams;
    })
  }

  const HeaderBtns = [
    {
      textColor: "black",
      bgColor: "blue-200",
      icon: "fa-regular fa-user",
      onClick: openLoginForm,
    },
    {
      textColor: "black",
      bgColor: "purple-200",
      icon: "fa-solid fa-ellipsis-vertical",
    },
    {
      textColor: "white",
      bgColor: "black",
      icon: "fa-solid fa-chevron-left",
      onClick: toPrevWeek,
    },
    {
      textColor: "white",
      bgColor: "black",
      icon: "fa-solid fa-chevron-right",
      onClick: toNextWeek,
    },
  ]

  const [isSmall, setIsSmall] = React.useState(window.innerWidth < 1024);

  const handleResize = () => {
    setIsSmall(window.innerWidth < 1024);

  }

  React.useEffect(() => {
    window.addEventListener("resize",  handleResize)
    return () => {
      window.removeEventListener("resize",  handleResize)
    }
  }, [])

  let monthName = months[new Date().getMonth()];
  if (isSmall) monthName = monthName.slice(0, 4) + '.'; 
  return (
    <header className="max-container flex justify-between max-lg:border-b max-lg:border-gray-200 items-center w-full gap-12 padding-x py-3 lg:py-6 bg-white max-lg:fixed top-0 left-0">
        <h1 className={"text-xl font-[700] lg:text-4xl tracking-tighter " + (+searchParams.get("weekShift") && 'text-blue-600')}>{monthName} {new Date().getFullYear()}</h1>

        <div className="flex gap-3">
            {
              HeaderBtns.map((btn, index) => (
                <HeaderBtn {...btn} key={index} />
              ))
            }
        </div>
    </header>
  )
}

export default Header