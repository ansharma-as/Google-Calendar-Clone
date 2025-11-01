import { Response } from 'express';
import User from '../models/User';
import { UserPreferencesSchema } from '../validators/authValidator';
import { AuthRequest } from '../middleware/auth';

export const getPreferences = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id).select('preferences');

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user.preferences,
    });
  } catch (error: any) {
    console.error('Get preferences error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get preferences',
    });
  }
};

export const updatePreferences = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validatedData = UserPreferencesSchema.parse(req.body);

    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { $set: { preferences: validatedData } },
      { new: true, runValidators: true }
    ).select('preferences');

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Preferences updated successfully',
      data: user.preferences,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({
        success: false,
        error: 'Invalid preferences data',
        details: error.errors,
      });
      return;
    }

    console.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update preferences',
    });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      res.status(400).json({
        success: false,
        error: 'Name is required',
      });
      return;
    }

    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { $set: { name: name.trim() } },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        _id: user._id,
        email: user.email,
        name: user.name,
        preferences: user.preferences,
      },
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile',
    });
  }
};
