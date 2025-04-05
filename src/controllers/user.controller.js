import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    // res.status(200).json({
    //     message: "ok !!"
    // });

    // Get user details from frontend

    const {userName, fullName, email, password} = req.body

    // validation - non empty

    if([userName, fullName, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // check if user already exist ? 

    const existedUser = await User.findOne({
        $or: [{userName}, {email}]
    })

    if(existedUser) {
        throw new ApiError(409, "Username or email already exists, Choose another");
    }

    // check for images and avatar

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    // Another way of writing the above line coverImageLocalPath

    // let coverImageLocalPath;
    // if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    //     coverImageLocalPath = req.files.coverImage[0].path;
    // }

    if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }

    // upload them to cloudinary, avatar

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar) {
        throw new ApiError(400, "Avatar file is required");
    }

    // create user object - create entry in db

    const user = await User.create({
        fullName, 
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email, 
        password,
        userName: userName.toLowerCase()
    });

    // remove password and refresh token feild from response

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    // check for user creation

    if(!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    // return res

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    );

});

export {registerUser};