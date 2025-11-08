const Submission = require('../models/submission.model');
const { NotFoundError, BadRequestError } = require('../utils/errorHandler');

const submissionController = {
    // Get all submissions for an assignment
    getSubmissions: async (req, res, next) => {
        try {
            const { assignmentId } = req.params;
            const submissions = await Submission.find({ assignment: assignmentId })
                .populate('student', 'name email')
                .populate('assignment', 'title');
            res.json(submissions);
        } catch (err) {
            next(err);
        }
    },

    // Get a single submission by ID
    getSubmission: async (req, res, next) => {
        try {
            const { id } = req.params;
            const submission = await Submission.findById(id)
                .populate('student', 'name email')
                .populate('assignment', 'title');
            
            if (!submission) {
                throw new NotFoundError('Submission not found');
            }
            
            res.json(submission);
        } catch (err) {
            next(err);
        }
    },

    // Create a new submission
    createSubmission: async (req, res, next) => {
        try {
            const { assignment, student, content, files } = req.body;
            const submission = new Submission({
                assignment,
                student,
                content,
                files,
                submittedAt: new Date()
            });
            
            await submission.save();
            res.status(201).json(submission);
        } catch (err) {
            next(err);
        }
    },

    // Update a submission
    updateSubmission: async (req, res, next) => {
        try {
            const { id } = req.params;
            const { grade, feedback, status } = req.body;
            
            const submission = await Submission.findByIdAndUpdate(
                id,
                { grade, feedback, status, gradedAt: new Date() },
                { new: true }
            );
            
            if (!submission) {
                throw new NotFoundError('Submission not found');
            }
            
            res.json(submission);
        } catch (err) {
            next(err);
        }
    },

    // Delete a submission
    deleteSubmission: async (req, res, next) => {
        try {
            const { id } = req.params;
            const submission = await Submission.findByIdAndDelete(id);
            
            if (!submission) {
                throw new NotFoundError('Submission not found');
            }
            
            res.json({ message: 'Submission deleted successfully' });
        } catch (err) {
            next(err);
        }
    },

    // Grade a submission
    gradeSubmission: async (req, res, next) => {
        try {
            const { id } = req.params;
            const { grade, feedback } = req.body;
            
            if (!grade) {
                throw new BadRequestError('Grade is required');
            }
            
            const submission = await Submission.findByIdAndUpdate(
                id,
                { 
                    grade,
                    feedback: feedback || '',
                    gradedAt: new Date(),
                    status: 'graded'
                },
                { new: true, runValidators: true }
            );
            
            if (!submission) {
                throw new NotFoundError('Submission not found');
            }
            
            res.json({
                success: true,
                message: 'Submission graded successfully',
                data: submission
            });
        } catch (err) {
            next(err);
        }
    },

    // Check for plagiarism in submissions
    checkPlagiarism: async (req, res, next) => {
        try {
            const { assignmentId } = req.body;
            
            if (!assignmentId) {
                throw new BadRequestError('Assignment ID is required');
            }
            
            // Get all submissions for this assignment
            const submissions = await Submission.find({ assignment: assignmentId })
                .populate('student', 'name email')
                .select('content student');
            
            if (submissions.length < 2) {
                return res.json({
                    success: true,
                    message: 'Not enough submissions to check for plagiarism',
                    data: []
                });
            }
            
            // Simple text similarity check (for demonstration)
            // In a real application, you would use a proper plagiarism detection service
            const results = [];
            
            for (let i = 0; i < submissions.length; i++) {
                for (let j = i + 1; j < submissions.length; j++) {
                    const sub1 = submissions[i];
                    const sub2 = submissions[j];
                    
                    // Simple similarity check (word-based)
                    const words1 = sub1.content ? sub1.content.toLowerCase().split(/\s+/) : [];
                    const words2 = sub2.content ? sub2.content.toLowerCase().split(/\s+/) : [];
                    
                    if (words1.length === 0 || words2.length === 0) continue;
                    
                    const commonWords = words1.filter(word => words2.includes(word));
                    const similarity = (commonWords.length / Math.max(words1.length, words2.length)) * 100;
                    
                    if (similarity > 30) { // Threshold: 30% similarity
                        results.push({
                            submission1: {
                                id: sub1._id,
                                student: sub1.student,
                                content: sub1.content
                            },
                            submission2: {
                                id: sub2._id,
                                student: sub2.student,
                                content: sub2.content
                            },
                            similarity: Math.round(similarity * 100) / 100 // Round to 2 decimal places
                        });
                    }
                }
            }
            
            res.json({
                success: true,
                message: 'Plagiarism check completed',
                data: results
            });
            
        } catch (err) {
            next(err);
        }
    }
};

module.exports = submissionController;