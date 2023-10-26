---
title: "About Me"
date: 2023-10-26T00:00:00+00:00
draft: false
description: "About Me"
images: ["/Apple-Devices-Preview.png"]

lightgallery: false

math:
  enable: true
---

<div class="row">
  <div class="column-60">
    <img src="/images/denali1.jpg" alt="Me walking away from the camera in Alaska">
  </div>
  <div class="column-40">
    <p>Hello! I"m David - a highly experienced technology leader with 16 years of software engineering experience.
    </p>
  </div>
</div>




{{< echarts >}}
{
  "title": {
    "top": "2%",
    "left": "center"
  },
  "tooltip": {
    "trigger": "axis"
  },
  "grid": {
    "left": "5%",
    "right": "5%",
    "bottom": "5%",
    "top": "20%",
    "containLabel": true
  },
  "toolbox": {
    "feature": {
      "saveAsImage": {
        "title": "Save as Image"
      }
    }
  },
  "series": [
    {
      "type": "sunburst",
      "radius": [0, "95%"],
      "emphasis": {
        "focus": "ancestor"
      },
      "levels": [
        {},
        {
          "r0": "15%",
          "r": "55%",
          "itemStyle": {
            "borderWidth": 2
          },
          "label": {
            "position": "inside",
            "rotate": "tangential"
          }
        },
        {
          "r0": "55%",
          "r": "70%",
          "label": {
            "position": "outside",
            "padding": 3
          }
        }
      ],
      "data": [
        {
          "name": "Languages & Frameworks",
          "children": [
            {
              "name": "Python",
              "value": 50
             
            },
            {
              "name": "Go",
              "value": 20
             
            },
            {
              "name": "Java",
              "value": 5
             
            },
            {
              "name": "C#",
              "value": 5
            },
            {
              "name": "C",
              "value": 1
            },
            {
             "name": "React",
              "value": 10
            },
            {
             "name": "Django",
              "value": 30
            }
          ]
        },
        {
          "name": "Platforms",
          "children": [
            {
             "name": "Kubernetes",
              "value": 20
            },
            {
             "name": "AWS",
              "value": 60
            },
            {
             "name": "AWS",
              "value": 60
            }
          ]
        },
        {
          "name": "Tools",
          "children": [
            {
             "name": "Terraform",
              "value": 15
            },
            {
             "name": "PlantUML",
              "value": 40
            }
          ]
        },
        {
          "name": "Techniques",
          "children": [
            {
             "name": "Requirements gathering",
              "value": 15
            },
            {
             "name": "Techincal design",
              "value": 50
            },
            {
             "name": "Cybersecurity",
              "value": 30
            },
            {
             "name": "Solution architecture",
              "value": 30
            },
            {
             "name": "Enterprise architecture",
              "value": 10
            }
          ]
        }
      ]
    }
  ]
}
{{< /echarts >}}