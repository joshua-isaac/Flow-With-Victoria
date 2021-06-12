import React, { useState } from "react"
import { graphql, useStaticQuery } from "gatsby"
import "./ClassesBlock.scss"
import ScheduleTabItem from "../components/ScheduleTabItem"

const ClassesBlock = props => {
  // query for classes data
  const data = useStaticQuery(graphql`
    query {
      Schedule: allAgilityScheduleItem(
        sort: { order: ASC, fields: customFields___date }
      ) {
        nodes {
          customFields {
            title
            productID
            price
            duration
            description
            date
            image {
              url
            }
          }
        }
      }
      membershipPlan: agilityClassesBlock(
        properties: { referenceName: { eq: "classes_classesblock" } }
      ) {
        linkedContent_membership {
          customFields {
            monthlyPlanInterval
            monthlyPlanPrice
            name
            description
            weeklyPlanInterval
            weeklyPlanPrice
          }
        }
      }
      Packages: allAgilityPackageItem {
        nodes {
          customFields {
            title
            price
            description
            image {
              url
              label
            }
          }
        }
      }
      OneOnOne: allAgilityOneonOneItem(
        sort: { fields: properties___itemOrder }
      ) {
        nodes {
          customFields {
            title
            price
            description
          }
        }
      }
    }
  `)

  // get class types
  const schedule = data.Schedule
  const packages = data.Packages
  const oneonone = data.OneOnOne

  // get featured plan
  const membershipPlan = data.membershipPlan.linkedContent_membership

  // put class types in array
  const tabContent = [
    {
      type: "Schedule",
      content: schedule,
    },
    {
      type: "Packages",
      content: packages,
    },
    {
      type: "One-on-One",
      content: oneonone,
    },
  ]

  // set active class type
  const [active, setActive] = useState(tabContent[0])

  // handle changing tab
  const handleClick = newTab => {
    setActive(newTab)
  }

  return (
    <div className="classes_tabs">
      <div className="tab__buttons">
        {tabContent.map((tab, i) => (
          <button
            key={tab.type}
            className={tab.type === active.type ? "active" : ""}
            onClick={() => handleClick(tab)}
          >
            {tab.type}
          </button>
        ))}
      </div>
      <div className="tab__content">
        {tabContent.map((tab, i) => {
          if (tab.type === active.type) {
            // return schedule tab type
            if (active.type === "Schedule") {
              return (
                <div key={tab.type} className="schedule__tab">
                  <h1>{active.type}</h1>
                  {active.content.nodes.map((node, i) => {
                    return <ScheduleTabItem item={node} key={i} />
                  })}
                </div>
              )
            } else if (active.type === "Packages") {
              // else return packages tab
              return (
                membershipPlan && (
                  <div key={tab.type} className="other__tab">
                    <h1>{active.type}</h1>
                    <div className="other__tab-item">
                      <h4 className="other__tab-title">
                        {membershipPlan.customFields.name}
                      </h4>
                      <p className="other__tab-price">
                        Weekly & Monthly plans available
                      </p>
                      <p className="other__tab-description">
                        {membershipPlan.customFields.description}
                      </p>
                      <button
                        // Snipcart Default Button Config
                        className="snipcart-add-item"
                        data-item-id={membershipPlan.customFields.name}
                        data-item-name={membershipPlan.customFields.name}
                        data-item-image={membershipPlan.customFields.image}
                        data-item-price={
                          membershipPlan.customFields.monthlyPlanPrice
                        }
                        data-item-url="/api/products"
                        data-item-description={
                          membershipPlan.customFields.description
                        }
                        data-item-selected-plan="weekly-plan"
                        // Weekly Plan
                        data-plan1-id="weekly-plan"
                        data-plan1-name="Weekly"
                        data-plan1-frequency="weekly"
                        data-plan1-interval={
                          membershipPlan.customFields.weeklyPlanInterval
                        }
                        data-item-plan1-price={
                          membershipPlan.customFields.weeklyPlanPrice
                        }
                        // Monthly Plan
                        data-plan2-id="monthly-plan"
                        data-plan2-name="Monthly"
                        data-plan2-frequency="monthly"
                        data-plan2-interval={
                          membershipPlan.customFields.monthlyPlanInterval
                        }
                        data-item-plan2-price={
                          membershipPlan.customFields.monthlyPlanPrice
                        }
                      >
                        Sign Up
                      </button>
                    </div>
                    {active.content.nodes.map((node, i) => {
                      return (
                        <div className="other__tab-item" key={i}>
                          <h4 className="other__tab-title">
                            {node.customFields.title}
                          </h4>
                          <p className="other__tab-price">
                            ${node.customFields.price}
                          </p>
                          <p className="other__tab-description">
                            {node.customFields.description}
                          </p>
                          <button
                            className="snipcart-add-item"
                            data-item-id={node.customFields.title}
                            data-item-price={node.customFields.price}
                            data-item-url="/api/products"
                            data-item-description={
                              node.customFields.description
                            }
                            data-item-image={node.customFields?.image.url}
                            data-item-name={node.customFields.title}
                          >
                            Sign Up
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )
              )
              // else return one-on-one tab
            } else {
              return (
                <div key={tab.type} className="other__tab">
                  <h1>{active.type}</h1>
                  {active.content.nodes.map((node, i) => {
                    return (
                      <div className="other__tab-item" key={i}>
                        <h4 className="other__tab-title">
                          {node.customFields.title}
                        </h4>
                        <p className="other__tab-price">
                          ${node.customFields.price}
                        </p>
                        <p className="other__tab-description">
                          {node.customFields.description}
                        </p>
                        <button
                          className="snipcart-add-item"
                          data-item-id={node.customFields.title}
                          data-item-price={node.customFields.price}
                          data-item-url="/api/products"
                          data-item-description={node.customFields.description}
                          // data-item-image={node.customFields?.image?.url}
                          data-item-name={node.customFields.title}
                        >
                          Sign Up
                        </button>
                      </div>
                    )
                  })}
                </div>
              )
            }
          }
        })}
      </div>
    </div>
  )
}

export default ClassesBlock
