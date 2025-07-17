const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.register = async (req, res) => {
    const { email, password, name } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { email, password: hashedPassword, name },
        });
        res
            .status(201)
            .json({ message: "User created successfully", userId: user.id });
    } catch (error) {
        res.status(400).json({ error: "Email already exists or invalid data" });
    }
};

exports.login = (req, res) => {
    const payload = {
        sub: req.user.id,
        name: req.user.name,
        role: req.user.role,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token });
};
