import React from 'react'

export default function FooterComponent () {
    return (
        <footer className="bg-dark text-white text-center py-3 mt-auto">
            <div className="container">
                <span><small>JeremyAliwa | All Right Reserved &copy; {new Date().getFullYear()}</small></span>
            </div>
        </footer>
    )
}

