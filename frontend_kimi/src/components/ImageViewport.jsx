import polarBear from "../assets/polar-bear.jpeg";

export default function ImageViewport({ imageRef, onClick, box }) {
    return (
        <div className="card" onClick={onClick}>
            <img
                ref={imageRef}
                src={polarBear}
                alt="hidden object"
                draggable={false}
            />
            {box && (
                <div
                    className={`guess-box ${box.status}`}
                    style={{
                        left: `calc(${box.x}% - 4%)`,
                        top: `calc(${box.y}% - 4%)`,
                    }}
                />
            )}
        </div>
    );
}
