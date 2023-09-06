import React, { useState, state } from "react"
import { graphql } from "gatsby"
import axios from "axios"

import ResourceCard from "./resource-card"

const ResourceGrid = ({ resources }) => {
  return (
    <div>
      <div className="container py-20 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {resources.map((resource, index) => (
          <ResourceCard
            resource={resource.attributes}
            key={resource.id}
            index={index}
          />
        ))}
      </div>
    </div>
  )
}

export default ResourceGrid
