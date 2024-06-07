import React from 'react'

const FooterComponent = () => {
    return (
        <footer className="bg-dark text-white text-center py-3 mt-auto">
            <div className="container">
                <span>JeremyAliwa | All Right Reserved &copy; {new Date().getFullYear()}</span>
            </div>
        </footer>
    )
}

export default FooterComponent