// const SubSection = require("../models/SubSection");
// const Section = require("../models/Section");
// const { uploadImageToCloudinary } = require("../utils/imageUploader");


// // create subsection 
// exports.createSubSection = async (req,res) => {
//     try{
//         // fetch data 
//         const {sectionId, title, timeDuration, description} = req.body;

//         //extract file/video
//         const video = req.files.videoFile;

//         // validation
//         if(!sectionId || !title || !timeDuration || !description || !video) {
//             return res.status(400).json({
//                 success: false,
//                 message: "All fields are required"
//             });
//         }

//         // upload video to cloudinary
//         const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);

//         //create a subsection
//         const SubSectionDetails = await SubSection.create({
//             title: title,
//             timeDuration: timeDuration,
//             description: description,
//             videoUrl: uploadDetails.secure_url
//         });

//         //update section with subSection ObjectID
//         const updatedSection = await Section.findByIdAndUpdate({_id:sectionId}, {$push:{subSection:SubSectionDetails._id}}, {new:true});

//         //return response
//         return res.status(200).json({
//             success: true,
//             message:"SubSection Created Successfully",
//             updatedSection
//         });
//     }
//     catch(error) {
//         return res.status(500).json({
//             success: false,
//             message:"Unable to Create SubSection, please try again",
//             error: error.message
//         });
//     }
// };

// //update subsection 
// exports.updateSubSection = async (req,res) => {
//     try{
//         // fetch data  
//         const {sectionId, subSectionId, title, description, timeDuration} = req.body;

//         //extract file/video
//         const video = req.files.videoFile;

//         //validation 
//         if(!subSectionId || !title || !timeDuration || !description || !video) {
//             return res.status(400).json({
//                 success: false,
//                 message: "All fields are required"
//             });
//         }

//         // upload video to cloudinary
//         const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);

//         //update data
//         const subSection = await SubSection.findByIdAndUpdate(
//                                     subSectionId,
//                                     {
//                                         title: title,
//                                         timeDuration: timeDuration,
//                                         description: description,
//                                         videoUrl: uploadDetails.secure_url
//                                     },
//                                     {new: true}
//                                 );
                        
//         // find updated section and return it
//         const updatedSection = await Section.findById(sectionId).populate(
//         "subSection"
//         )
        
//         // return res
//         return res.status(200).json({
//             success: true,
//             message:"SubSection Updated Successfully",
//             updatedSection
//         });
//     }
//     catch(error){
//         return res.status(500).json({
//             success: true,
//             message:"Unable to Update SubSection, please try again",
//             error: message.error
//         });
//     }
// };

// //delete SubSection
// exports.deleteSubSection = async (req, res) => {
//     try{
//         //fetch data -> assuming we are sending ID in params
//         const {subSectionId} = req.body;

//         //find and delete 
//         await SubSection.findByIdAndUpdate(subSectionId);

//         // return res
//         return res.status(200).json({
//             success: true,
//             message:"SubSection Deleted Successfully",
//             updateCourseDetails
//         });
//     }
//     catch(error){
//         return res.status(500).json({
//             success: true,
//             message:"Unable to Delete SubSection, please try again",
//             error: message.error
//         });
//     }
// }



// Import necessary modules
const Section = require("../models/Section")
const SubSection = require("../models/SubSection")
const { uploadImageToCloudinary } = require("../utils/imageUploader")

// Create a new sub-section for a given section
exports.createSubSection = async (req, res) => {
  try {
    // Extract necessary information from the request body
    const { sectionId, title, description } = req.body
    const video = req.files.video

    // Check if all necessary fields are provided
    if (!sectionId || !title || !description || !video) {
      return res
        .status(404)
        .json({ success: false, message: "All Fields are Required" })
    }
    console.log(video)

    // Upload the video file to Cloudinary
    const uploadDetails = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    )
    console.log(uploadDetails)
    // Create a new sub-section with the necessary information
    const SubSectionDetails = await SubSection.create({
      title: title,
      timeDuration: `${uploadDetails.duration}`,
      description: description,
      videoUrl: uploadDetails.secure_url,
    })

    // Update the corresponding section with the newly created sub-section
    const updatedSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      { $push: { subSection: SubSectionDetails._id } },
      { new: true }
    ).populate("subSection")

    // Return the updated section in the response
    return res.status(200).json({ success: true, data: updatedSection })
  } catch (error) {
    // Handle any errors that may occur during the process
    console.error("Error creating new sub-section:", error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

exports.updateSubSection = async (req, res) => {
  try {
    const { sectionId, subSectionId, title, description } = req.body
    const subSection = await SubSection.findById(subSectionId)

    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      })
    }

    if (title !== undefined) {
      subSection.title = title
    }

    if (description !== undefined) {
      subSection.description = description
    }
    if (req.files && req.files.video !== undefined) {
      const video = req.files.video
      const uploadDetails = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_NAME
      )
      subSection.videoUrl = uploadDetails.secure_url
      subSection.timeDuration = `${uploadDetails.duration}`
    }

    await subSection.save()

    // find updated section and return it
    const updatedSection = await Section.findById(sectionId).populate(
      "subSection"
    )

    console.log("updated section", updatedSection)

    return res.json({
      success: true,
      message: "Section updated successfully",
      data: updatedSection,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the section",
    })
  }
}

exports.deleteSubSection = async (req, res) => {
  try {
    const { subSectionId, sectionId } = req.body
    await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $pull: {
          subSection: subSectionId,
        },
      }
    )
    const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId })

    if (!subSection) {
      return res
        .status(404)
        .json({ success: false, message: "SubSection not found" })
    }

    // find updated section and return it
    const updatedSection = await Section.findById(sectionId).populate(
      "subSection"
    )

    return res.json({
      success: true,
      message: "SubSection deleted successfully",
      data: updatedSection,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the SubSection",
    })
  }
}