import ratelimit from "../config/upstash.js";

const ratelimiter = async (req, res, next) => {
    try {
        const { success } = await ratelimit.limit("my-rate-limit")

        if(!success){
            return res.status(429).json({
                message:"Muitos pedidos, por favor tente novamente mais tarde."
            });
        }

        next();

    } catch (error) {
        console.log("erro de limite de taxa", error)
        next(error);
    }
};

export default ratelimiter;
